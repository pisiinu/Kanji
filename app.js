document.addEventListener('DOMContentLoaded', () => {
    const kanjiGrid = document.getElementById('kanji-grid');
    const resultsCount = document.getElementById('results-count');
    const modeRadios = document.getElementsByName('mode');
    const readingFilter = document.getElementById('reading-filter');
    const matchTypeSelect = document.getElementById('match-type-select');
    const radicalSelect = document.getElementById('radical-select');
    const sortSelect = document.getElementById('sort-select');
    const sortNote = document.getElementById('sort-note');

    let currentMode = 'fiction'; // 'fiction', 'all', 'real'
    let currentReading = '';
    let currentMatchType = 'prefix'; // 'prefix', 'exact', 'partial'
    let currentRadical = '';
    let currentSort = 'default'; // 'default', 'strokes'
    
    let currentFiltered = [];
    let currentRenderCount = 0;
    const BATCH_SIZE = 300;
    
    // Create a Load More button
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'load-more-btn';
    loadMoreBtn.textContent = 'さらに表示';
    loadMoreBtn.style.display = 'none';

    // Link external static sponsor logic (evade adblockers)
    let storedAds = typeof sponsorLinks !== 'undefined' ? sponsorLinks : [];
    
    // Observer to automatically load more
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            renderNextBatch();
        }
    }, { rootMargin: "0px 0px 500px 0px" });
    
    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    function renderKanji() {
        kanjiGrid.innerHTML = '';
        
        const searchReading = currentReading.trim();
        const searchRadical = currentRadical.trim();
        
        const radicalCounts = {};

        const filtered = kanjiData.filter(item => {
            // Evaluate mode
            let modeMatch = false;
            if (currentMode === 'all') {
                modeMatch = true;
            } else if (currentMode === 'fiction') {
                modeMatch = !item.isNameAllowed;
            } else if (currentMode === 'real') {
                modeMatch = item.isNameAllowed;
            }

            // Evaluate reading
            let readingMatch = true;
            if (searchReading) {
                const checkMatch = (r, search) => {
                    if (currentMatchType === 'exact') return r === search;
                    if (currentMatchType === 'prefix') return r.startsWith(search);
                    return r.includes(search);
                };

                // Determine reading presence flexibly
                readingMatch = item.readings.some(r => checkMatch(r, searchReading));
                
                // Allow user to write in hiragana but match katakana, and vice versa
                if (!readingMatch) {
                     const asKatakana = searchReading.replace(/[\u3041-\u3096]/g, function(match) {
                         var chr = match.charCodeAt(0) + 0x60;
                         return String.fromCharCode(chr);
                     });
                     const asHiragana = searchReading.replace(/[\u30a1-\u30f6]/g, function(match) {
                        var chr = match.charCodeAt(0) - 0x60;
                        return String.fromCharCode(chr);
                     });
                     readingMatch = item.readings.some(r => checkMatch(r, asKatakana) || checkMatch(r, asHiragana));
                }
            }

            // Count available radicals dynamically before filtering them
            if (modeMatch && readingMatch) {
                item.radicals.forEach(rad => {
                    radicalCounts[rad] = (radicalCounts[rad] || 0) + 1;
                });
            }

            // Evaluate radical
            let radicalMatch = true;
            if (searchRadical) {
                radicalMatch = item.radicals.some(r => r.includes(searchRadical));
            }

            // If sorting by Jinmeiyo year, ONLY display Jinmeiyo kanji
            let jinmeiyoMatch = true;
            if (currentSort.startsWith('jinmeiyo')) {
                jinmeiyoMatch = item.kanjiType === 'jinmeiyo';
            }

            return modeMatch && readingMatch && radicalMatch && jinmeiyoMatch;
        });

        // Update dropdown options to show counts
        Array.from(radicalSelect.options).forEach(opt => {
            if (opt.value === "") return;
            const count = radicalCounts[opt.value] || 0;
            if (!opt.dataset.baseLabel) {
                opt.dataset.baseLabel = opt.textContent;
            }
            opt.textContent = `${opt.dataset.baseLabel} [${count}件]`;
        });

        // Apply Sorting
        if (currentSort === 'strokes') {
            filtered.sort((a, b) => (a.strokes || 99) - (b.strokes || 99));
        } else if (currentSort === 'strokes_desc') {
            filtered.sort((a, b) => (b.strokes || 0) - (a.strokes || 0));
        } else if (currentSort === 'freq') {
            filtered.sort((a, b) => (a.freq || 9999) - (b.freq || 9999));
        } else if (currentSort === 'freq_desc') {
            filtered.sort((a, b) => (b.freq || -1) - (a.freq || -1));
        } else if (currentSort === 'kanken' || currentSort === 'kanken_desc') {
            const kankenOrder = {"10":1, "9":2, "8":3, "7":4, "6":5, "5":6, "2～4":7, "2〜4":7, "準1":8, "1":9};
            filtered.sort((a, b) => {
                const valA = kankenOrder[a.kankenGrade] || 99;
                const valB = kankenOrder[b.kankenGrade] || 99;
                return currentSort === 'kanken' ? valA - valB : valB - valA;
            });
        } else if (currentSort === 'jinmeiyo') {
            filtered.sort((a, b) => (a.jinmeiyoYear || 9999) - (b.jinmeiyoYear || 9999));
        } else if (currentSort === 'jinmeiyo_desc') {
            filtered.sort((a, b) => (b.jinmeiyoYear || 0) - (a.jinmeiyoYear || 0));
        }

        currentFiltered = filtered;
        currentRenderCount = 0;
        
        resultsCount.textContent = `${filtered.length} 件の漢字が見つかりました`;

        // Update sort note
        if (currentSort.startsWith('freq')) {
            sortNote.textContent = '※ KANJIDIC2準拠朝日新聞の数年分の記事を解析して集計された統計データに基づく';
            sortNote.style.display = 'block';
        } else if (currentSort.startsWith('kanken')) {
            sortNote.textContent = '※ 日本漢字能力検定の級に準拠';
            sortNote.style.display = 'block';
        } else if (currentSort.startsWith('jinmeiyo')) {
            sortNote.textContent = '※ 京都大学 安岡孝一教授の『人名用漢字表の変遷』データに準拠';
            sortNote.style.display = 'block';
        } else {
            sortNote.style.display = 'none';
        }

        renderNextBatch(true);
    }
    
    function renderNextBatch(isInitial = false) {
        if (isInitial) {
            kanjiGrid.innerHTML = '';
            observer.disconnect();
            kanjiGrid.parentNode.appendChild(loadMoreBtn);
        }

        const fragment = document.createDocumentFragment();
        const batch = currentFiltered.slice(currentRenderCount, currentRenderCount + BATCH_SIZE);
        
        // Approx kanji item width is 95px + 12px gap = 107px
        let itemsPerRow = Math.max(1, Math.floor((kanjiGrid.clientWidth + 12) / 107));
        // Change ad frequency: First after 3 rows, then every 10 rows
        const itemsToAd = itemsPerRow * 10;
        const offsetToFirstAd = itemsPerRow * 3;

        batch.forEach((item, index) => {
            const globalIndex = currentRenderCount + index;
            // Inject Sponsor Card
            if (storedAds.length > 0 && globalIndex >= offsetToFirstAd && (globalIndex - offsetToFirstAd) % itemsToAd === 0) {
                const infoCard = document.createElement('div');
                infoCard.className = 'info-panel';
                const randomAd = storedAds[Math.floor(Math.random() * storedAds.length)];
                infoCard.innerHTML = `<div class="info-label">Sponsor</div>${randomAd}`;
                fragment.appendChild(infoCard);
            }

            const card = document.createElement('a');
            const statusClass = item.isNameAllowed ? `allowed allowed-${item.kanjiType}` : 'not-allowed';
            const badgeClass = item.isNameAllowed ? (item.kanjiType === 'joyo' ? 'badge-joyo' : 'badge-jinmeiyo') : 'badge-ng';
            const badgeText = item.isNameAllowed ? (item.kanjiType === 'joyo' ? '常用漢字' : '人名漢字') : '人名不可';
            const strokesText = item.strokes ? `${item.strokes}画` : '';
            
            card.className = `kanji-card ${statusClass}`;
            card.href = `https://ja.wiktionary.org/wiki/${encodeURIComponent(item.kanji)}`;
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.title = `${item.kanji}の意味を見る - 読み: ${item.readings.join(', ')} / 部首: ${item.radicals.join(', ')}`;
            
            // Extra display for sorting context validation
            let extraInfo = '';
            if (currentSort.startsWith('freq') && item.freq && item.freq !== 9999) {
                extraInfo = `頻度順位: ${item.freq}位`;
            } else if (currentSort.startsWith('kanken') && item.kankenGrade) {
                extraInfo = `漢検: ${item.kankenGrade}級`;
            } else if (currentSort.startsWith('jinmeiyo') && item.jinmeiyoYear) {
                extraInfo = `人名解禁: ${item.jinmeiyoYear}年`;
            }

            card.innerHTML = `
                <div class="card-header">
                    <span class="badge ${badgeClass}">${badgeText}</span>
                    <span class="stroke-count">${strokesText}</span>
                </div>
                <div class="kanji-character">${escapeHtml(item.kanji)}</div>
                <div class="kanji-info">
                    <div class="kanji-info-text">${escapeHtml(item.readings.join(', '))}</div>
                    ${extraInfo ? `<div class="kanji-meta-info">${escapeHtml(extraInfo)}</div>` : ''}
                </div>
            `;
            fragment.appendChild(card);
        });

        kanjiGrid.appendChild(fragment);
        currentRenderCount += batch.length;
        
        // Append a sponsor card at the very end if we didn't inject one during the loop because total items was less than 10 rows
        if (storedAds.length > 0 && currentFiltered.length < itemsToAd && currentRenderCount === currentFiltered.length && currentFiltered.length > 0) {
            const infoCard = document.createElement('div');
            infoCard.className = 'info-panel';
            const randomAd = storedAds[Math.floor(Math.random() * storedAds.length)];
            infoCard.innerHTML = `<div class="info-label">Sponsor</div>${randomAd}`;
            kanjiGrid.appendChild(infoCard);
        }
        
        if (currentRenderCount < currentFiltered.length) {
            loadMoreBtn.style.display = 'block';
            observer.observe(loadMoreBtn);
        } else {
            loadMoreBtn.style.display = 'none';
            observer.unobserve(loadMoreBtn);
        }
    }

    // Populate Radical Select
    if (typeof kangxiRadicals !== 'undefined') {
        Object.entries(kangxiRadicals).forEach(([num, char]) => {
            const opt = document.createElement('option');
            opt.value = char;
            opt.textContent = `${char} (${num}画周辺)`; // Simple label for the dropdown
            radicalSelect.appendChild(opt);
        });
    }

    // Event Listeners
    modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentMode = e.target.value;
            renderKanji();
        });
    });

    readingFilter.addEventListener('input', (e) => {
        currentReading = e.target.value;
        renderKanji();
    });

    matchTypeSelect.addEventListener('change', (e) => {
        currentMatchType = e.target.value;
        renderKanji();
    });

    radicalSelect.addEventListener('change', (e) => {
        currentRadical = e.target.value;
        renderKanji();
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderKanji();
    });

    loadMoreBtn.addEventListener('click', () => {
        renderNextBatch();
    });

    // Initial Render
    renderKanji();
});

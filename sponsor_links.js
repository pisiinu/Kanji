// ここにAmazonアソシエイトの「画像とテキスト」などのHTMLタグをカンマ区切りで追加します。
const sponsorLinks = [
    `<a href="https://amzn.to/3PJeiaF" target="_blank" rel="noopener noreferrer" style="display:flex; flex-direction:row; justify-content:center; align-items:center; gap:0.5rem; text-decoration:none; color:inherit; padding:0.25rem;">
        <strong style="font-size:0.85rem; text-align:left; line-height:1.2;">最高の名前を贈る 男の子の幸せ名前事典</strong>
        <span style="font-size:0.7rem; color:var(--accent-color); white-space:nowrap; border:1px solid var(--accent-color); border-radius:4px; padding:0.2rem 0.4rem;">Amazon</span>
    </a>`,
    `<a href="https://amzn.to/4rCXMq8" target="_blank" rel="noopener noreferrer" style="display:flex; flex-direction:row; justify-content:center; align-items:center; gap:0.5rem; text-decoration:none; color:inherit; padding:0.25rem;">
        <strong style="font-size:0.85rem; text-align:left; line-height:1.2;">最高の名前を贈る 女の子の幸せ名前事典</strong>
        <span style="font-size:0.7rem; color:var(--accent-color); white-space:nowrap; border:1px solid var(--accent-color); border-radius:4px; padding:0.2rem 0.4rem;">Amazon</span>
    </a>`,
    `<a href="https://amzn.to/3NlLPHn" target="_blank" rel="noopener noreferrer" style="display:flex; flex-direction:row; justify-content:center; align-items:center; gap:0.5rem; text-decoration:none; color:inherit; padding:0.25rem;">
        <strong style="font-size:0.85rem; text-align:left; line-height:1.2;">最高の名前を贈る 赤ちゃんの幸せ名前事典</strong>
        <span style="font-size:0.7rem; color:var(--accent-color); white-space:nowrap; border:1px solid var(--accent-color); border-radius:4px; padding:0.2rem 0.4rem;">Amazon</span>
    </a>`,
    `<a href="https://amzn.to/4ddyhZ9" target="_blank" rel="noopener noreferrer" style="display:flex; flex-direction:row; justify-content:center; align-items:center; gap:0.5rem; text-decoration:none; color:inherit; padding:0.25rem;">
        <strong style="font-size:0.85rem; text-align:left; line-height:1.2;">プロの小説家が教える クリエイターのための名付けの技法書</strong>
        <span style="font-size:0.7rem; color:var(--accent-color); white-space:nowrap; border:1px solid var(--accent-color); border-radius:4px; padding:0.2rem 0.4rem;">Amazon</span>
    </a>`,
    `<a href="https://amzn.to/476R04H" target="_blank" rel="noopener noreferrer" style="display:flex; flex-direction:row; justify-content:center; align-items:center; gap:0.5rem; text-decoration:none; color:inherit; padding:0.25rem;">
        <strong style="font-size:0.85rem; text-align:left; line-height:1.2;">プロの小説家が教える クリエイターのための語彙力図鑑 性格・人物編</strong>
        <span style="font-size:0.7rem; color:var(--accent-color); white-space:nowrap; border:1px solid var(--accent-color); border-radius:4px; padding:0.2rem 0.4rem;">Amazon</span>
    </a>`,
    `<a href="https://amzn.to/3PseIlH" target="_blank" rel="noopener noreferrer" style="display:flex; flex-direction:row; justify-content:center; align-items:center; gap:0.5rem; text-decoration:none; color:inherit; padding:0.25rem;">
        <strong style="font-size:0.85rem; text-align:left; line-height:1.2;">創作ネーミング辞典 (ことば選び辞典)</strong>
        <span style="font-size:0.7rem; color:var(--accent-color); white-space:nowrap; border:1px solid var(--accent-color); border-radius:4px; padding:0.2rem 0.4rem;">Amazon</span>
    </a>`
        `<a href="https://amzn.to/4bpJHHP" target="_blank" rel="noopener noreferrer" style="display:flex; flex-direction:row; justify-content:center; align-items:center; gap:0.5rem; text-decoration:none; color:inherit; padding:0.25rem;">
        <strong style="font-size:0.85rem; text-align:left; line-height:1.2;">クリエーターのためのネーミング辞典</strong>
        <span style="font-size:0.7rem; color:var(--accent-color); white-space:nowrap; border:1px solid var(--accent-color); border-radius:4px; padding:0.2rem 0.4rem;">Amazon</span>
    </a>`
        `<a href="https://amzn.to/4lLCENc" target="_blank" rel="noopener noreferrer" style="display:flex; flex-direction:row; justify-content:center; align-items:center; gap:0.5rem; text-decoration:none; color:inherit; padding:0.25rem;">
        <strong style="font-size:0.85rem; text-align:left; line-height:1.2;">クリエーターのための人名ネーミング辞典</strong>
        <span style="font-size:0.7rem; color:var(--accent-color); white-space:nowrap; border:1px solid var(--accent-color); border-radius:4px; padding:0.2rem 0.4rem;">Amazon</span>
    </a>`    
        `<a href="https://amzn.to/3NWpT5P" target="_blank" rel="noopener noreferrer" style="display:flex; flex-direction:row; justify-content:center; align-items:center; gap:0.5rem; text-decoration:none; color:inherit; padding:0.25rem;">
        <strong style="font-size:0.85rem; text-align:left; line-height:1.2;">幻想ネーミング辞典</strong>
        <span style="font-size:0.7rem; color:var(--accent-color); white-space:nowrap; border:1px solid var(--accent-color); border-radius:4px; padding:0.2rem 0.4rem;">Amazon</span>
    </a>` 
        `<a href="https://amzn.to/40Mi9X6" target="_blank" rel="noopener noreferrer" style="display:flex; flex-direction:row; justify-content:center; align-items:center; gap:0.5rem; text-decoration:none; color:inherit; padding:0.25rem;">
        <strong style="font-size:0.85rem; text-align:left; line-height:1.2;">和の幻想ネーミング辞典</strong>
        <span style="font-size:0.7rem; color:var(--accent-color); white-space:nowrap; border:1px solid var(--accent-color); border-radius:4px; padding:0.2rem 0.4rem;">Amazon</span>
    </a>`     
        `<a href="https://amzn.to/4ssV6g4" target="_blank" rel="noopener noreferrer" style="display:flex; flex-direction:row; justify-content:center; align-items:center; gap:0.5rem; text-decoration:none; color:inherit; padding:0.25rem;">
        <strong style="font-size:0.85rem; text-align:left; line-height:1.2;">幻想人名辞典</strong>
        <span style="font-size:0.7rem; color:var(--accent-color); white-space:nowrap; border:1px solid var(--accent-color); border-radius:4px; padding:0.2rem 0.4rem;">Amazon</span>
    </a>`         
];

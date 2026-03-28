// 1. 剧本配置：你可以随时在这里增加对话
const gameScript = [
    { name: "琴濑", text: "毕竟是本店的招牌红茶呢，学长请务必品尝一下。",bg: "背景4.png" },
    { name: "琴濑", text: "（脸红）那个...其实泡茶的时候，我一直在想学长的事情。",bg: "背景4.png" },
    { name: "学长", text: "（有些意外）是吗？难怪这杯茶喝起来格外香甜呢。",bg: "背景1.png" },
    { name: "琴濑", text: "真的吗？太好了！那...学长愿意一直喝我泡的茶吗？",bg: "背景1.png" }
];

// 2. 状态变量
let currentBg = "";     // 当前背景图路径
let currentIndex = 0;   // 当前进行到第几句
let charIndex = 0;      // 当前打印到第几个字
let isTyping = false;   // 状态锁：是否正在打字中
let timer = null;       // 计时器

// 3. 获取页面上的 DOM 元素
const nameTag = document.querySelector('.name-tag');
const dialogueText = document.querySelector('.dialogue-text');
const gameContainer = document.querySelector('.game-container');
const sprite = document.querySelector('.character-sprite'); 
const bgm = document.getElementById('bgm');

// 4. 逐字打印函数
function typeWriter() {
    const currentLine = gameScript[currentIndex];
    
    if (charIndex < currentLine.text.length) {
        sprite.classList.add('is-speaking');
        isTyping = true;
        // 核心：每次增加一个字符
        dialogueText.textContent += currentLine.text.charAt(charIndex);
        charIndex++;
        // 递归调用：50ms 后跑下一个字符
        timer = setTimeout(typeWriter, 50);
    } else {
        // 打印结束
        sprite.classList.remove('is-speaking');
        isTyping = false;
        clearTimeout(timer);
    }
}

// 5. 显示新一行的初始设置
function showLine() {
    // 清空状态
    charIndex = 0;
    dialogueText.textContent = ""; 
    clearTimeout(timer);
    const currentLine = gameScript[currentIndex];

    // 👈 核心逻辑：检查背景
    if (currentLine.bg && currentLine.bg !== currentBg) {
        changeBackground(currentLine.bg); // 执行切换动画
        currentBg = currentLine.bg;      // 更新记录，防止这一句还没播完又切一次
    }
    // 设置名字
    nameTag.textContent = gameScript[currentIndex].name;
    
    // 开始打字
    typeWriter();
}

// 6. 交互逻辑：点击容器触发
gameContainer.addEventListener('click', () => {
    bgm.play();
    if (isTyping) {
        // 状态 A：如果正在打字，点击则瞬间显示全文
        clearTimeout(timer);
        dialogueText.textContent = gameScript[currentIndex].text;
        isTyping = false;
    } else {
        // 状态 B：如果文字已经播完，点击则进入下一句
        currentIndex++;
        if (currentIndex < gameScript.length) {
            showLine();
        } else {
            // 剧终处理
            nameTag.textContent = "提示";
            dialogueText.textContent = "—— 剧情已结束，感谢学长的陪伴。 ——";
        }
    }
});

function changeBackground(newSrc) {
    const bgContainer = document.querySelector('.background');
    const bgImg = bgContainer.querySelector('img'); // 获取里面的图片标签

    // 1. 先变黑（触发 CSS 中的 opacity 0.8s 过渡）
    bgContainer.classList.add('bg-black'); 

    // 2. 等 800ms（等它完全黑透）
    setTimeout(() => {
        bgImg.src = newSrc; // 偷偷换掉图片的路径
        
        // 3. 换好后，把黑屏类删掉，图片就会淡入显示
        bgContainer.classList.remove('bg-black'); 
    }, 100);
}




// 7. 初始化：页面加载后自动开始第一句
window.onload = showLine;
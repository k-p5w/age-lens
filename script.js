/* ==================================================
   ねんれいレンズ - 完全版 script.js
================================================== */


const currentAgeInput = document.getElementById("currentAge");
const currentBirthYearInput = document.getElementById("currentBirthYear");
const thisYear = new Date().getFullYear(); // 2026

// 年齢が変わったら生まれ年を計算
currentAgeInput.addEventListener("input", () => {
    const age = parseInt(currentAgeInput.value);
    currentBirthYearInput.value = thisYear - age;
    update(); // 計算を更新
});

// 生まれ年が変わったら年齢を計算
currentBirthYearInput.addEventListener("input", () => {
    const birthYear = parseInt(currentBirthYearInput.value);
    currentAgeInput.value = thisYear - birthYear;
    update(); // 計算を更新
});

let presetData = {};

async function loadPresetData() {
    const response = await fetch("presetData.json");
    presetData = await response.json();
}

// 起動時
window.addEventListener("DOMContentLoaded", async () => {
    await loadPresetData();

    // ここから presetData を使う処理
});

document.getElementById("presetCategory").addEventListener("change", function () {
    const category = this.value;
    const presetList = document.getElementById("presetList");

    // 初期化
    presetList.innerHTML = '<option value="">-- プリセットを選択 --</option>';

    if (presetData[category]) {
        presetData[category].forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.year;
            opt.textContent = item.label;
            presetList.appendChild(opt);
        });
    }
});

document.getElementById("presetList").addEventListener("change", function () {
    const year = this.value;
    if (year) {
        document.getElementById("targetYear").value = year;

        // ★ これを追加する
        update();
    }
});



const CURRENT_YEAR = new Date().getFullYear();

// DOM要素の取得
const ageInput = document.getElementById("currentAge");
const yearInput = document.getElementById("targetYear");
const slider = document.getElementById("compareAge");
const sliderValue = document.getElementById("sliderValue");
const ageDirectInput = document.getElementById("compareAgeInput");
const birthYearInput = document.getElementById("compareBirthYear");
const hero = document.getElementById("mainResult");
const table = document.getElementById("resultTable");
const presetInput = document.getElementById("preset");

/* --- 計算ロジック --- */
function calcDistance(age, targetYear) {
    const diff = CURRENT_YEAR - targetYear;
    if (diff <= 0) return 0;
    let d = 0;
    for (let i = 0; i < diff; i++) {
        let currentIterAge = Math.max(1, age - i);
        d += 1 / currentIterAge;
    }
    return d;
}

function convertAge(compareAge, distance) {
    let sum = 0, back = 0;
    while (compareAge - back > 0 && sum < distance) {
        sum += 1 / (compareAge - back);
        back++;
    }
    return back;
}

function buildTable(distance) {
    if (!table) return;
    table.innerHTML = "";
    for (let age = 6; age <= 20; age++) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const passedYears = convertAge(age, distance);
        const feltYear = CURRENT_YEAR - passedYears;
        td1.textContent = age + "歳";
        td2.textContent = "約 " + passedYears + " 年前 (" + feltYear + "年)";
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
    }
}
function update() {
    const currentYear = new Date().getFullYear();
    const baseAge = Number(ageInput.value);      // A
    const targetYear = Number(yearInput.value);
    const compareAge = Number(slider.value);     // B

    const resultContent = document.getElementById("resultContent");
    resultContent.classList.remove("placeholder");

    if (baseAge <= 0) {
        resultContent.innerHTML = `<p>基準者（A）の年齢は 1 歳以上で入力してください。</p>`;
        return;
    }

    const birthYearA = currentYear - baseAge;
    const birthYearB = currentYear - compareAge;



    /* 1. A にとって「生まれる前」の出来事 */
    if (targetYear < birthYearA) {
        const yearsBeforeBirthA = birthYearA - targetYear;
        const ratio = yearsBeforeBirthA / baseAge;
        const feltYearsB = compareAge * (1.0 + ratio);
        const feltYear = currentYear - feltYearsB;


        resultContent.innerHTML = `
        <p><strong>${targetYear}年</strong> は、${baseAge}歳の方にとっては<br>
        生まれる前の <strong>${yearsBeforeBirthA} 年前</strong> の出来事です。</p>

        <p>これを <strong>${compareAge}歳</strong> の方の感覚に換算すると、<br>
        <strong>${Math.floor(feltYear)} 年</strong>頃 の感覚になります。</p>

        <p><small>※約 ${feltYearsB.toFixed(0)} 年前、人生の ${(1.0 + ratio).toFixed(1)} 倍もの時間を遡るような深さです。<br>
        </small></p>
    `;
        return;
    }

    /* 2. A にとって通常の過去 */
    const distance = calcDistance(baseAge, targetYear);
    const passedYears = convertAge(compareAge, distance);
    const feltYear = currentYear - passedYears;

    resultContent.innerHTML = `
<p><strong>${baseAge}歳</strong>の方にとっての
<strong>${targetYear}年（約${currentYear - targetYear}年前）</strong> は、</p>

<p>これを <strong>${compareAge}歳</strong> の方の感覚に置き換えると、<br>
<strong>${Math.floor(feltYear)}年（約${passedYears.toFixed(0)}年前）</strong> に相当します。</p>
`;


    buildTable(distance);
}

function syncAndUpdate(val) {
    let age = Math.max(1, Math.min(120, Number(val)));
    if (slider) slider.value = age;
    if (ageDirectInput) ageDirectInput.value = age;
    if (birthYearInput) birthYearInput.value = CURRENT_YEAR - age;
    update();
}

/* --- イベントリスナー --- */
ageInput?.addEventListener("input", update);
yearInput?.addEventListener("input", update);
slider?.addEventListener("input", (e) => syncAndUpdate(e.target.value));
ageDirectInput?.addEventListener("input", (e) => syncAndUpdate(e.target.value));
birthYearInput?.addEventListener("input", (e) => {
    // 生まれ年から年齢を計算して同期
    syncAndUpdate(CURRENT_YEAR - Number(e.target.value));
});

presetInput?.addEventListener("change", () => {
    if (presetInput.value !== "") {
        yearInput.value = presetInput.value;
        update();
    }
});

document.querySelectorAll('.preset-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
        // タブの active 切り替え
        document.querySelectorAll('.preset-tabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // セレクトボックスの切り替え
        const tab = btn.dataset.tab;
        document.querySelectorAll('.preset-content').forEach(sel => sel.classList.remove('active'));
        document.getElementById(`preset-${tab}`).classList.add('active');
    });
});


document.getElementById("swapAB").addEventListener("click", () => {
    const ageA = Number(document.getElementById("currentAge").value);
    const ageB = Number(document.getElementById("compareAge").value);

    // A ←→ B 入れ替え
    document.getElementById("currentAge").value = ageB;
    document.getElementById("currentBirthYear").value = CURRENT_YEAR - ageB;

    document.getElementById("compareAge").value = ageA;
    document.getElementById("compareAgeInput").value = ageA;
    document.getElementById("compareBirthYear").value = CURRENT_YEAR - ageA;

    // スライダー横の表示も更新
    const sliderValue = document.getElementById("sliderValue");
    if (sliderValue) sliderValue.textContent = ageA + "歳";

    update();
});

// --- 初回だけ初期化（A=50歳、B=25歳、基準西暦=現在-10） ---
window.addEventListener("DOMContentLoaded", () => {
    const CURRENT_YEAR = new Date().getFullYear();

    // A（基準者）
    document.getElementById("currentAge").value = 50;
    document.getElementById("currentBirthYear").value = CURRENT_YEAR - 50;

    // B（比較対象者）
    document.getElementById("compareAge").value = 25;
    document.getElementById("compareAgeInput").value = 25;
    document.getElementById("compareBirthYear").value = CURRENT_YEAR - 25;
    document.getElementById("sliderValue").textContent = "25歳";

    // 基準西暦（targetYear）を「現在の年 - 10」にする
    document.getElementById("targetYear").value = CURRENT_YEAR - 10;

    update(); // 初期表示を反映
});



// 初期実行
update();
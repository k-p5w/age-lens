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

/* --- 更新・同期処理 --- */
/* --- 更新・同期処理 --- */
function update() {
    // 【修正】現在の年を固定ではなく自動取得にする
    const currentYear = new Date().getFullYear(); 

    const baseAge = Number(ageInput.value);
    const targetYear = Number(yearInput.value);
    const compareAge = Number(slider.value);

    if (sliderValue) sliderValue.textContent = compareAge + "歳";

    // 【修正】計算にも自動取得した変数を使う
    const birthYear = currentYear - baseAge;
    const resultContent = document.getElementById("resultContent");

    if (targetYear < birthYear) {
        if (resultContent) {
            resultContent.innerHTML = `
                <p><strong>${targetYear}年</strong> は、${baseAge}歳の方（${birthYear}年生まれ）が生まれる前の出来事です。</p>
            `;
        }
        return;
    }

    if (targetYear > currentYear) {
        if (resultContent) {
            resultContent.innerHTML = `<p>未来の出来事はまだ「過去の感覚」として測ることができません。</p>`;
        }
        return;
    }

    const distance = calcDistance(baseAge, targetYear);
    const passedYears = convertAge(compareAge, distance);
    const feltYear = currentYear - passedYears;

    if (resultContent) {
        resultContent.innerHTML = `
            <p><strong>${baseAge}歳</strong>の方にとっての <strong>${targetYear}年</strong> は、
            <br><br><strong>${compareAge}歳</strong>の方にとっては<br><br>
            <strong>約 ${passedYears.toFixed(0)} 年前 （${feltYear} 年）</strong> の感覚です。</p>
        `;
    }
    
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

    // A と B を入れ替え
    document.getElementById("currentAge").value = ageB;
    document.getElementById("compareAge").value = ageA;
    document.getElementById("compareAgeInput").value = ageA;
    document.getElementById("compareBirthYear").value = CURRENT_YEAR - ageA;

    update();
});


// 初期実行
update();
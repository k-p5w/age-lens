/* ==================================================
   ねんれいレンズ - 完全版 script.js
================================================== */

const CURRENT_YEAR = new Date().getFullYear();

// DOM要素の取得
const ageInput = document.getElementById("currentAge");
const yearInput = document.getElementById("targetYear");
const slider = document.getElementById("compareAge");
const sliderValue = document.getElementById("sliderValue");
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

/* --- テーブル生成関数 (これが不足していました) --- */
function buildTable(distance) {
    table.innerHTML = "";
    // 6歳から20歳まで、5歳刻みなどで一覧を作る
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

/* --- UI更新処理 --- */
function update() {
    const baseAge = Number(ageInput.value);
    const targetYear = Number(yearInput.value);
    const compareAge = Number(slider.value);

    sliderValue.textContent = compareAge + "歳";

    if (isNaN(baseAge) || isNaN(targetYear) || baseAge < 1) {
        hero.innerHTML = "<p>正しい数値を入力してください。</p>";
        return;
    }

    const distance = calcDistance(baseAge, targetYear);
    const passedYears = convertAge(compareAge, distance);
    const feltYear = CURRENT_YEAR - passedYears;

    hero.innerHTML = `
        <p><strong>${baseAge}歳</strong>の方にとっての <strong>${targetYear}年</strong> は、
        <br><br><strong>${compareAge}歳</strong>の方にとっては<br><br>
        <strong>約 ${passedYears} 年前 （${feltYear} 年）</strong> の感覚です。</p>
    `;

    // テーブル生成を呼び出し
    buildTable(distance);
}

/* --- イベントリスナー --- */
ageInput?.addEventListener("input", update);
yearInput?.addEventListener("input", update);
slider?.addEventListener("input", update);

presetInput?.addEventListener("change", () => {
    if (presetInput.value !== "") {
        yearInput.value = presetInput.value;
        update();
    }
});

// 初期実行
update();
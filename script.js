/*
=========================================
ねんれいレンズ
script.js
=========================================
*/

const CURRENT_YEAR = new Date().getFullYear();

const ageInput =
    document.getElementById("currentAge");

const presetInput =
    document.getElementById("preset");

const yearInput =
    document.getElementById("targetYear");

const button =
    document.getElementById("calculateButton");

const slider =
    document.getElementById("compareAge");

const sliderValue =
    document.getElementById("sliderValue");

const hero =
    document.getElementById("mainResult");

const table =
    document.getElementById("resultTable");


/*
---------------------------------
プリセット同期
---------------------------------
*/

presetInput?.addEventListener(
    "change",
    () => {

        if (
            presetInput.value !== ""
        ) {

            yearInput.value =
                presetInput.value;

        }

    }
);


/*
---------------------------------
スライダー表示
---------------------------------
*/

slider?.addEventListener(
    "input",
    () => {

        sliderValue.textContent =
            slider.value + "歳";

        update();

    }
);


/*
---------------------------------
ボタン
---------------------------------
*/

button?.addEventListener(
    "click",
    () => {

        update();

    }
);


/*
---------------------------------
体感距離

現在は

Σ(1/age)

モデル

あとで
lnモデルへ変更可能
---------------------------------
*/

function calcDistance(
    currentAge,
    targetYear
) {

    const diff =
        CURRENT_YEAR - targetYear;

    if (diff <= 0) {

        return 0;

    }

    let d = 0;

    for (
        let i = 0;
        i < diff;
        i++
    ) {

        let age =
            currentAge - i;

        if (age < 1) {

            age = 1;

        }

        d += 1 / age;

    }

    return d;

}


/*
---------------------------------
逆変換

distanceを満たすまで

1/age

を積む
---------------------------------
*/

function convertAge(

    compareAge,

    distance

) {

    let sum = 0;

    let back = 0;

    while (

        compareAge - back > 0

        &&

        sum < distance

    ) {

        sum +=

            1 / (compareAge - back);

        back++;

    }

    return CURRENT_YEAR - back;

}


/*
---------------------------------
テーブル生成
---------------------------------
*/

function buildTable(

    distance

) {

    table.innerHTML = "";

    for (

        let age = 6;

        age <= 20;

        age++

    ) {

        const tr =

            document.createElement("tr");

        const td1 =

            document.createElement("td");

        const td2 =

            document.createElement("td");

        td1.textContent =

            age + "歳";

        td2.textContent =

            "約 "

            +

            convertAge(

                age,

                distance

            )

            +

            " 年";

        tr.appendChild(td1);

        tr.appendChild(td2);

        table.appendChild(tr);

    }

}


/*
---------------------------------
Hero表示
---------------------------------
*/

function buildHero(

    distance

) {

    const compare =

        Number(

            slider.value

        );

    const result =

        convertAge(

            compare,

            distance

        );

    hero.innerHTML =

        `
<div>

<h3>

${compare}歳なら

</h3>

<h1>

約 ${result} 年

</h1>

<p>

あなたが見ている出来事は、

${compare}歳の感覚では

このくらいの近さです。

</p>

</div>
`;

}


/*
---------------------------------
入力チェック
---------------------------------
*/

function validate() {

    const age =

        Number(

            ageInput.value

        );

    const year =

        Number(

            yearInput.value

        );

    if (

        isNaN(age)

        ||

        isNaN(year)

    ) {

        return null;

    }

    if (

        age < 1

        ||

        age > 120

    ) {

        return null;

    }

    return {

        age,

        year

    };

}


/*
---------------------------------
更新
---------------------------------
*/

function update() {

    const data =

        validate();

    if (

        data === null

    ) {

        hero.innerHTML =

            "<h2>入力を確認してください</h2>";

        return;

    }

    const distance =

        calcDistance(

            data.age,

            data.year

        );

    buildHero(

        distance

    );

    buildTable(

        distance

    );

}


/*
---------------------------------
初期表示
---------------------------------
*/

update();

const urls = {
    'ExactMatch': 'exam_LEval_leaderboard.csv',
    'LLMJudge': 'llm_LEval_leaderboard.csv',
    'GPT3.5Judge': 'turbo_LEval_leaderboard.csv',
    'F1': 'f1_LEval_leaderboard.csv',
    'ROUGE': 'rouge_LEval_leaderboard.csv'
}

const examRadio = document.getElementById('ExactMatch');
const llmRadio = document.getElementById('LLMJudge');
const gpt35Radio = document.getElementById('GPT3.5Judge');
const f1Radio = document.getElementById('F1');
const rougeRadio = document.getElementById('ROUGE');
let table = document.getElementById('csvTable');
let currentUrl = urls['ExactMatch'];

function updateTable(csv) {
    // 删除现有的表头
    while (table.tHead.rows[0].cells.length > 0) {
        table.tHead.rows[0].deleteCell(0);
    }
    // 删除现有的表格内容
    while (table.tBodies[0].rows.length > 0) {
        table.tBodies[0].deleteRow(0);
    }
    Papa.parse(csv, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            let data = results.data;

            // 获取HTML元素
            let headerRow = table.tHead.rows[0];
            let tableBody = table.tBodies[0];
            // 创建表头
            for (let key in data[0]) {
                let th = document.createElement('th');
                th.textContent = key;
                th.dataset.column = key;
                th.addEventListener('click', function () {
                    sortTableByColumn(key, th);
                });
                th.addEventListener('mouseover', function () {
                    highlightColumn(key);
                });
                th.addEventListener('mouseout', function () {
                    unhighlightColumn(key);
                });

                headerRow.appendChild(th);
            }
            // 创建表格主体
            for (let i = 0; i < data.length; i++) {
                let row = document.createElement('tr');
                for (let key in data[i]) {
                    let td = document.createElement('td');
                    td.textContent = data[i][key];
                    row.appendChild(td);
                }
                tableBody.appendChild(row);
            }
            highlightMaxValues(table);

        }
    });
}

// 标记每列的最大值
function highlightMaxValues(table) {
    let tBody = table.tBodies[0];
    let rows = Array.from(tBody.querySelectorAll("tr"));
    let cols = Array.from(table.tHead.querySelector("tr").children);

    cols.forEach((col, i) => {
        let values = rows.map(row => row.children[i].textContent);
        if (values.every(val => !isNaN(val))) {
            let maxVal = Math.max(...values.map(val => parseFloat(val)));
            rows.forEach(row => {
                if (parseFloat(row.children[i].textContent) === maxVal) {
                    row.children[i].classList.add('max-value');
                } else {
                    row.children[i].classList.remove('max-value');
                }
            });
        }
    });
}



function updateCautionMessage(evaluator) {
    let cautionText;
    if (evaluator === 'LLMJudge') {
        cautionText = 'GPT4 and GPT3.5 may favor models with longer outputs and/or those that were fine-tuned on their outputs.';
    }
     else if (evaluator === 'ROUGE') {
        cautionText = 'ROUGE and F1 score may favor predictions with similar length with the ground truth.';
    }else if (evaluator === 'ExactMatch') {
        cautionText = '1. EM score is easily affected by prompt engineering if it can reduce the difficulty of extracting the correct answer from the outputs\n 2. please also notice that The topic retrieval score is only comparable when the number of input tokens is the same';
    }
    document.getElementById('caution').innerText = 'Caution:' + cautionText + "\n" + "*Hint: if you click on a column header, the rows in the table will be re-ordered based on the values in that column.";
}


// 高亮整列
function highlightColumn(columnName) {
    let cells = document.getElementsByClassName(columnName);
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.add('highlight');
    }
}

// 取消高亮整列
function unhighlightColumn(columnName) {
    let cells = document.getElementsByClassName(columnName);
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove('highlight');
    }
}

// 排序表格
function sortTableByColumn(column, th) {
    let table = th.closest('table');
    let tBody = table.tBodies[0];
    let rows = Array.from(tBody.querySelectorAll("tr"));
    let dirModifier = th.dataset.order === 'asc' ? -1 : 1;

    const sortedRows = rows.sort((a, b) => {
        let aColText = a.querySelector(`td:nth-child(${Array.from(th.parentNode.children).indexOf(th) + 1})`).textContent.trim();
        let bColText = b.querySelector(`td:nth-child(${Array.from(th.parentNode.children).indexOf(th) + 1})`).textContent.trim();

        if (!isNaN(aColText)) {
            aColText = parseFloat(aColText);
        }

        if (!isNaN(bColText)) {
            bColText = parseFloat(bColText);
        }

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    sortedRows.forEach(tr => tBody.appendChild(tr));

    // 记住当前的排序方式
    th.dataset.order = th.dataset.order === 'asc' ? 'desc' : 'asc';
}



updateTable(urls['ExactMatch']);

examRadio.addEventListener('click', function () {
    currentUrl = urls['ExactMatch'];
    updateTable(currentUrl);
    updateCautionMessage('ExactMatch');
});

llmRadio.addEventListener('click', function () {
    currentUrl = urls['LLMJudge'];
    updateTable(currentUrl);
    updateCautionMessage('LLMJudge');
});

gpt35Radio.addEventListener('click', function () {
    currentUrl = urls['GPT3.5Judge'];
    updateTable(currentUrl);
    updateCautionMessage('LLMJudge');
});


rougeRadio.addEventListener('click', function () {
    currentUrl = urls['ROUGE'];
    updateTable(currentUrl);
    updateCautionMessage('ROUGE');
});

f1Radio.addEventListener('click', function () {
    currentUrl = urls['F1'];
    updateTable(currentUrl);
    updateCautionMessage('ROUGE');
});

updateCautionMessage('ExactMatch');

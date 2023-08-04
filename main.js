// // 使用Papa Parse从CSV文件中获取数据
// Papa.parse("exam_LEval_leaderboard.csv", {
//   download: true,
//     header: true,
//     dynamicTyping: true,
//     complete: function(results) {
//         let data = results.data;
//
//         // 获取HTML元素
//         let table = document.getElementById('csvTable');
//         let headerRow = table.tHead.rows[0];
//         let tableBody = table.tBodies[0];
//
//         // 找出每列的最大值
//         let columnMaxValues = {};
//         for (let key in data[0]) {
//             if (isNaN(data[0][key])) continue; // 如果该列不是数字，跳过
//             columnMaxValues[key] = Math.max(...data.map(row => parseFloat(row[key])));
//         }
//
//         // 创建表头
//         let idx = 0;
//         for (let key in data[0]) {
//             let th = document.createElement('th');
//             th.textContent = key;
//             th.addEventListener('mouseover', function() {
//                 highlightColumn(key);
//             });
//             th.addEventListener('mouseout', function() {
//                 unhighlightColumn(key);
//             });
//             th.addEventListener('click', function() {
//                 sortTableByColumn(table, idx);
//             });
//             headerRow.appendChild(th);
//             idx++;
//         }
//
//         // 创建表格主体
//         for (let i = 0; i < data.length; i++) {
//             let row = document.createElement('tr');
//             for (let key in data[i]) {
//                 let td = document.createElement('td');
//                 td.classList.add(key); // 添加类名以便于高亮整列
//                 if (typeof data[i][key] === 'number') {
//                     // 如果是数字，则保留两位小数
//                     td.textContent = data[i][key].toFixed(2);
//                 } else {
//                     td.textContent = data[i][key];
//                 }
//                 if (data[i][key] == columnMaxValues[key]) {
//                     // 如果是最大值，则加粗显示
//                     td.classList.add('max-value');
//                 }
//                 row.appendChild(td);
//             }
//             tableBody.appendChild(row);
//         }
//     }
// });
//
// // 高亮整列
// function highlightColumn(columnName) {
//     let cells = document.getElementsByClassName(columnName);
//     for (let i = 0; i < cells.length; i++) {
//         cells[i].classList.add('highlight');
//     }
// }
//
// // 取消高亮整列
// function unhighlightColumn(columnName) {
//     let cells = document.getElementsByClassName(columnName);
//     for (let i = 0; i < cells.length; i++) {
//         cells[i].classList.remove('highlight');
//     }
// }
//
// // 排序表格
// function sortTableByColumn(table, column, asc = true) {
//     const dirModifier = asc ? 1 : -1;
//     const tBody = table.tBodies[0];
//     const rows = Array.from(tBody.querySelectorAll("tr"));
//
//     // 检查列是否为数字
//     const isNumeric = rows.every(row => !isNaN(row.querySelectorAll("td")[column].textContent));
//
//     if (isNumeric) {
//         const sortedRows = rows.sort((a, b) => {
//             const aColText = parseFloat(a.querySelectorAll("td")[column].textContent.trim()) || 0;
//             const bColText = parseFloat(b.querySelectorAll("td")[column].textContent.trim()) || 0;
//
//             return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
//         });
//
//         while (tBody.firstChild) {
//             tBody.removeChild(tBody.firstChild);
//         }
//
//         sortedRows.forEach(tr => tBody.appendChild(tr));
//
//         // 记住当前的排序方式
//         table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
//         table.querySelector(`th:nth-child(${ column + 1 })`).classList.toggle("th-sort-asc", asc);
//         table.querySelector(`th:nth-child(${ column + 1 })`).classList.toggle("th-sort-desc", !asc);
//     }
// }

Papa.parse("exam_LEval_leaderboard.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function(results) {
        let data = results.data;

        // 获取HTML元素
        let table = document.getElementById('csvTable');
        let headerRow = table.tHead.rows[0];
        let tableBody = table.tBodies[0];
        // 创建表头
        for (let key in data[0]) {
            let th = document.createElement('th');
            th.textContent = key;
            th.dataset.column = key;
            th.addEventListener('click', function() {
                sortTableByColumn(key, th);
            });
            th.addEventListener('mouseover', function() {
                highlightColumn(key);
            });
            th.addEventListener('mouseout', function() {
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

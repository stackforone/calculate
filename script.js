function winNumber() {
    const input = document.getElementById('input-number').value;
    const excludeDouble = document.getElementById('exclude-checkbox').checked;
    let results = generateCombinations(input, excludeDouble);
    displayResults(results);
}

function generateCombinations(input, excludeDouble) {
    if (input.length < 2) {
        return ['ป้อนเลขอย่างน้อย 2 ตัว'];
    }

    let results = [];

    // เลข 3 ตัว ไม่รวมเบิ้ล
    if (input.length >= 3) {
        let combinations3 = generateUniqueCombinations(input, 3, false);
        results.push({ title: `เลข 3 ตัว ไม่รวมเบิ้ล`, combinations: combinations3 });
    }

    // เลข 2 ตัว ไม่รวมเบิ้ล
    let combinations2 = generateUniqueCombinations(input, 2, false);
    results.push({ title: `เลข 2 ตัว ไม่รวมเบิ้ล`, combinations: combinations2 });

    // กรณีรวมเบิ้ล
    if (!excludeDouble) {
        // เลข 3 ตัว รวมเบิ้ล
        let doubleCombinations3 = generateSpecificDoubleCombinations(input, 3, input.length === 4 ? 20 : 10);
        results.push({ title: `เลข 3 ตัว รวมเบิ้ล`, combinations: doubleCombinations3 });

        // เลข 2 ตัว รวมเบิ้ล
        let doubleCombinations2 = generateSpecificDoubleCombinations(input, 2, input.length === 4 ? 10 : 6);
        results.push({ title: `เลข 2 ตัว รวมเบิ้ล`, combinations: doubleCombinations2 });
    }

    return results;
}

function generateUniqueCombinations(input, length, includeDouble) {
    let combinations = [];

    function combine(prefix, chars) {
        if (prefix.length === length) {
            if (includeDouble || new Set(prefix).size === prefix.length) {
                combinations.push(prefix);
            }
            return;
        }

        for (let i = 0; i < chars.length; i++) {
            combine(prefix + chars[i], chars.slice(i + 1));
        }
    }

    combine('', input.split(''));
    return Array.from(new Set(combinations)).sort();
}

function generateSpecificDoubleCombinations(input, length, maxSets) {
    let combinations = [];
    let allCombinations = [];

    function combine(prefix, chars) {
        if (prefix.length === length) {
            allCombinations.push(prefix);
            return;
        }

        for (let i = 0; i < chars.length; i++) {
            combine(prefix + chars[i], chars);
        }
    }

    combine('', input.split(''));

    allCombinations.forEach(combo => {
        let set = new Set(combo.split(''));
        if (set.size !== combo.length || (set.size === combo.length && length === 2)) {
            combinations.push(combo);
        }
    });

    combinations = combinations.slice(0, maxSets);

    return Array.from(new Set(combinations)).sort();
}

function displayResults(results) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';

    results.forEach(resultSet => {
        let title = resultSet.title;
        let combinations = resultSet.combinations;
        resultContainer.appendChild(createResultSet(combinations, title));
    });
}

function createResultSet(results, title) {
    const resultSet = document.createElement('div');
    resultSet.className = 'result-set';

    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    resultSet.appendChild(titleElement);

    const resultText = results.join('-');
    const resultTextNode = document.createElement('p');
    resultTextNode.textContent = resultText;
    resultSet.appendChild(resultTextNode);

    const countText = document.createElement('p');
    countText.textContent = `(รวม ${results.length} ชุด)`;
    resultSet.appendChild(countText);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'คัดลอก';
    copyButton.onclick = function() {
        navigator.clipboard.writeText(resultText).then(() => {
            alert('คัดลอกสำเร็จ');
        });
    };
    resultSet.appendChild(copyButton);

    return resultSet;
}

function checkEnter(event) {
    if (event.key === "Enter") {
        winNumber();
    }
}

function resetForm() {
    document.getElementById('input-number').value = '';
    document.getElementById('exclude-checkbox').checked = false;
    document.getElementById('result').innerHTML = '';
}
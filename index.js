const input = document.getElementById("input");


input.addEventListener('keyup', (event) => {
    const inputText = event.target.value;

    var result;
    try {
        const ast = peg$parse(inputText);
        result = ast.evaluate();
    } catch (err) {
        result = err;
    }

    const output = document.getElementById("output");
    output.textContent = result;
});
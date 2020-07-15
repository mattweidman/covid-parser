const input = document.getElementById("input");


input.addEventListener('keyup', (event) => {
    console.log(event.target.value);

    const output = document.getElementById("output");
    output.textContent = event.target.value;
});
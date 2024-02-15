// Initialize variables
var editor = document.getElementById('editor');
var eventStack = [];
console.log("TEXT",editor.innerText);
function recordEvent(eventType,e) {
    var event = { type: eventType };

    // Record additional details based on event type
    switch (eventType) {
        case 'keydown':
            event.key = e.key;
            break;
        case 'cursor':
            var selection = window.getSelection();
            event.offset = selection.focusOffset; // Save cursor position
            break;
        case 'selection':
            var selection = window.getSelection();
            event.anchorOffset = selection.anchorOffset;
            event.focusOffset = selection.focusOffset;
            event.anchorNode = selection.anchorNode.textContent.substring(selection.anchorOffset, selection.anchorNode.length);
            event.focusNode = selection.focusNode.textContent.substring(0, selection.focusOffset);
            event.selectedText = selection.toString();
            break;
    }

    eventStack.push(event);

    // console.log(eventStack);
}


function updateLineNumbers() {

    console.log("TEXT",editor.innerText);
    let lines = editor.innerText.split("\n");
    let lineCount = lines.length;

    let lineNumbers = "";
    for (let i = 1; i <= lineCount; i++) {
        lineNumbers += (i) + "\n";
    }

    editor.setAttribute("data-line", lineNumbers);
}


// Add oninput event listener to call updateLineNumbers function
editor.addEventListener("input", updateLineNumbers);

// Event listeners to record events
editor.addEventListener('keydown', function(e) {
    recordEvent('keydown',e);
});

editor.addEventListener('mouseup', function(e) {
    if (window.getSelection().type === 'Range') {
        recordEvent('selection',e);
    } else {
        recordEvent('cursor',e);
    }
});
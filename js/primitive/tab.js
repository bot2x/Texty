
//This is our primitive. Will hold all the information and operations pertaining to a particular tab.
function Tab (tabId) {

    //todo : validate the tabId.
    let tabref = document.getElementById(tabId);

    function setCursorAt() {

    }

    function getCursorLocation () {

    }

    function getNumberOfCharacters () {

    }

    function getNumOfLines () {

    }

    function applyUndo () {

    }

    function applyRedo () {

    }

    return {
        setCursorAt,
        getCursorLocation,
        getNumberOfCharacters,
        getNumOfLines,
        applyUndo,
        applyRedo,
    }
}
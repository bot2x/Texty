
function getContainerForTab (tabButtonRef) { 
    containerId = tabButtonRef.id.trim() ? tabButtonRef.id.trim().split("-")[1] : "";
    return document.getElementById(containerId);
}

function getTabParentContainers(tablayoutId) {
    let nav_bar = document.createElement("nav");
    nav_bar.innerHTML = "This will be a nav bar soon";

    let editor_container = document.createElement("div");
    editor_container.id = `contain_editors_${tablayoutId}`
    editor_container.className = "tablayout_editor";

    let link_container = document.createElement("div");
    link_container.id = `contain_tablinks_${tablayoutId}`
    link_container.className = "tablayout_buttons"

    return {
        navBar : nav_bar,
        editorContainer : editor_container,
        linkContainer : link_container,
    }
}

function getTabDivPair (tabN, tablayoutId=null) {
    
    let div_tab = document.createElement("div");
    div_tab.id = `file${tabN}`;
    div_tab.className = "tabcontent";
    div_tab.contentEditable="true";
    div_tab.innerHTML = `Start typings in file - ${tabN}`;

    // let div_tab = `<div id="file${fileNum}" class="tabcontent">Start typings ..... </div>`
    let button_tab = document.createElement("button");
    button_tab.id = `tab-file${tabN}`;
    button_tab.className = `button_effect tablink`;
    button_tab.innerHTML = `File${tabN}`;
    //Avoid this here. This will be done during hydration stage.
    // button_tab.addEventListener('click', () => openTabHandler(button_tab));

    return {
        tabcontent : div_tab,
        tablink : button_tab,
    }
}

function getAddTabButton (tablayoutId) {
    //<button id="add_tab" class="button_effect">New File +</button>
    let add_tab = document.createElement("div");
    add_tab.id = `add_tab_${tablayoutId}`;
    add_tab.className = "type_add_tab button_effect";
    add_tab.innerHTML = "New File +";

    return add_tab;
}
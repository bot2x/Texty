
function getContainerForTab (tabButtonRef) {
    if (!tabButtonRef) {
        alert("[Undefined TabButtonRef]");
        return;
    }
    let id_split = tabButtonRef.id.trim().split(".")
    let layoutid = id_split[0]
    let containerName = id_split[1].split("-")[1]

    let containerId = layoutid + "." + containerName;

    return document.getElementById(containerId);
}

function getTabParentContainers(tablayoutId) {
    let nav_bar = document.createElement("nav");
    nav_bar.innerHTML = `NavBar for layoutId : ${tablayoutId}`;

    let editor_container = document.createElement("div");
    editor_container.id = `layout${tablayoutId}.contain_editors`
    editor_container.className = "tablayout_editor";

    let link_container = document.createElement("div");
    link_container.id = `layout${tablayoutId}.contain_tablinks`
    link_container.className = "tablayout_buttons"

    return {
        navBar : nav_bar,
        editorContainer : editor_container,
        linkContainer : link_container,
    }
}

function getTabDivPair (tabN, tablayoutId) {
    
    let div_tab = document.createElement("div");
    div_tab.id = `layout${tablayoutId}.file${tabN}`;
    div_tab.className = `tabcontent belongs_to_layout_${tablayoutId}`;
    div_tab.contentEditable="true";
    div_tab.innerHTML = `Start typings in file - ${tabN}`;

    // let div_tab = `<div id="file${fileNum}" class="tabcontent">Start typings ..... </div>`
    let button_tab = document.createElement("button");
    button_tab.id = `layout${tablayoutId}.tab-file${tabN}`;
    button_tab.className = `button_effect tablink belongs_to_layout_${tablayoutId}`;

    // button_tab.innerHTML = `File${tabN}`;
    
    let tab_name = document.createElement("span");
    tab_name.id = `layout${tablayoutId}.file${tabN}.filename`;
    tab_name.innerHTML = `File ${tabN}`;
    
    let close_tab = document.createElement("div");
    close_tab.id = `layout${tablayoutId}.file${tabN}.close`;
    close_tab.className = "closeTab";
    close_tab.innerHTML = " x ";

    button_tab.appendChild(tab_name);
    button_tab.appendChild(close_tab);

    return {
        tabcontent : div_tab,
        tablink : button_tab,
        closetab : close_tab
    }
}

function getAddTabButton (tablayoutId) {
    let add_tab = document.createElement("div");
    add_tab.id = `layout${tablayoutId}.add_tab`;
    add_tab.className = "type_add_tab button_effect";
    
    let innerSpan = document.createElement("span");
    innerSpan.innerHTML = "➕";
    add_tab.appendChild(innerSpan);

    return add_tab;
}

function getContainerForTab (tabButtonRef) { 
    containerId = tabButtonRef.id.trim() ? tabButtonRef.id.trim().split("-")[1] : "";
    return document.getElementById(containerId);
}
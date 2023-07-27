document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");

  window.addEventListener("resize", () => {
    // Atualizar as dimensões do contêiner quando a janela do navegador for redimensionada
    container.style.width = `${window.innerWidth}px`;
    container.style.height = `${window.innerHeight}px`;
  });

  let isDragging = false;
  let dragItem = null;
  let dragItemStartX = 0;
  let dragItemStartY = 0;
  let resizeHandle = null;
  let resizeStartX = 0;
  let resizeStartY = 0;
  let resizeStartWidth = 0;
  let resizeStartHeight = 0;

  container.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("dynamic-div")) {
      isDragging = true;
      dragItem = e.target;
      dragItemStartX = e.clientX - dragItem.getBoundingClientRect().left;
      dragItemStartY = e.clientY - dragItem.getBoundingClientRect().top;

      document.addEventListener("mousemove", moveDraggable);
    } else if (e.target.classList.contains("resize-handle")) {
      resizeHandle = e.target;
      dragItem = resizeHandle.parentElement;
      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      resizeStartWidth = dragItem.offsetWidth;
      resizeStartHeight = dragItem.offsetHeight;

      document.addEventListener("mousemove", resizeDiv);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    resizeHandle = null;
    document.removeEventListener("mousemove", moveDraggable);
    document.removeEventListener("mousemove", resizeDiv);
  });

  function moveDraggable(e) {
    if (isDragging && dragItem) {
      const x = e.clientX - container.getBoundingClientRect().left - dragItemStartX;
      const y = e.clientY - container.getBoundingClientRect().top - dragItemStartY;

      dragItem.style.left = `${Math.max(0, Math.min(x, container.offsetWidth - dragItem.offsetWidth))}px`;
      dragItem.style.top = `${Math.max(0, Math.min(y, container.offsetHeight - dragItem.offsetHeight))}px`;

      // Ajustar conteúdo interno ao redimensionar
      adjustContent(dragItem);
    }
  }

  function resizeDiv(e) {
    if (resizeHandle && dragItem) {
      const offsetX = e.clientX - resizeStartX;
      const offsetY = e.clientY - resizeStartY;

      const newWidth = resizeStartWidth + offsetX;
      const newHeight = resizeStartHeight + offsetY;

      dragItem.style.width = `${Math.max(50, newWidth)}px`;
      dragItem.style.height = `${Math.max(50, newHeight)}px`;

      // Ajustar conteúdo interno ao redimensionar
      adjustContent(dragItem);
    }
  }

  container.addEventListener("dblclick", (e) => {
    const newDiv = document.createElement("div");
    newDiv.className = "dynamic-div";
    newDiv.style.left = `${e.clientX - container.getBoundingClientRect().left}px`;
    newDiv.style.top = `${e.clientY - container.getBoundingClientRect().top}px`;

    const appName = prompt("Insira o código HTML:");

    if (appName.startsWith("http")) { 

    newDiv.innerHTML = `<iframe src="${appName}" frameborder="0"></iframe>`;
    } else {
    newDiv.innerHTML = appName
    }    

    const closeButton = document.createElement("button");
    closeButton.innerText = "Fechar";
    closeButton.addEventListener("click", () => {
      container.removeChild(newDiv);
    });

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "resize-handle";

    newDiv.appendChild(closeButton);
    newDiv.appendChild(resizeHandle);

    container.appendChild(newDiv);

    // Permite que os elementos sejam arrastados para dentro da div
    newDiv.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    newDiv.addEventListener("drop", (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("text/plain");
      newDiv.appendChild(document.getElementById(data));
    });

    // Ajustar conteúdo interno ao adicionar nova div
    adjustContent(newDiv);
  });

  function adjustContent(draggableDiv) {
    const iframe = draggableDiv.querySelector("iframe");
    if (iframe) {
      iframe.style.width = "100%";
      iframe.style.height = "100%";
    }
  }

  // Chamar a função de redimensionamento uma vez no início para garantir que o contêiner ocupe toda a área visível
  window.dispatchEvent(new Event("resize"));
});

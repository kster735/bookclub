const links = [
  document.getElementById("/bookclub/books"),
  document.getElementById("/bookclub/addbookform"),
  document.getElementById("/bookclub/about"),
];

links.forEach((elem) => {
  const url = location.href.toString().split("/")[4];

  if (elem.getAttribute("id") === "/bookclub/" + url) {
    elem.classList.add("active");
  } else {
    if (elem.classList.contains("active")) {
      elem.classList.remove("active");
    }
  }
});

// Business Logic
function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const formDataObject = {addons: []};
  for (let pair of formData.entries()) {
    const key = pair[0];
    const value = pair[1];

    if (formDataObject[key]) {
      if (Array.isArray(formDataObject[key])) {
        formDataObject[key].push(value);
      } else {
        formDataObject[key] = [formDataObject[key], value];
      }
    } else {
      formDataObject[key] = value;
    }
  }

  console.log(formDataObject);
}

// UI Logic

// Wait till load to execute all code
window.addEventListener("load", function() {
  document.getElementById("multi-step-form").addEventListener("submit", handleFormSubmit);
});
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

function createStepHandler() {
  let currentStep = 0;
  const steps = Array.from(document.querySelectorAll(".form__step"));
  const nextButton = document.getElementById("next-step-button");
  const backButton = document.getElementById("previous-step-button");
  const submitButton = document.getElementById("submit-button");

  function updateFormUI() {
    // Hide all steps
    steps.forEach(step => step.classList.add("hidden"));

    // Show current step
    steps[currentStep].classList.remove("hidden");

    // Hide back button on first step and show on other steps
    backButton.style.display = currentStep === 0 ? "none" : "block";

    // Hide next button on last step and show on other steps
    nextButton.style.display = currentStep === steps.length - 1 ? "none" : "block";

    // Show submit button on last step and hide on other steps
    submitButton.style.display = currentStep === steps.length - 1 ? "block" : "none";
  }

  return {
    handleStepChange: (stepNumber) => {
      currentStep += stepNumber;
      currentStep = Math.max(0, Math.min(steps.length - 1, currentStep));
      updateFormUI();
    },
    getCurrentStep: () => currentStep
  };
};

// Wait till load to execute all code
window.addEventListener("load", function() {
  const stepHandler = createStepHandler();
  document.getElementById("multi-step-form").addEventListener("submit", handleFormSubmit);
  document.getElementById("next-step-button").addEventListener("click", () => stepHandler.handleStepChange(1));
  document.getElementById("previous-step-button").addEventListener("click", () => stepHandler.handleStepChange(-1));
});
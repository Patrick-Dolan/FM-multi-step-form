// Business Logic
class Plans {
  constructor() {
    this.arcade = {
      monthly: 9,
      yearly: 90
    };
    this.advanced = {
      monthly: 12,
      yearly: 120
    };
    this.pro = {
      monthly: 15,
      yearly: 150
    };
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const formDataObject = {
    addons: [],
    billingFrequency: "monthly",
  };

  for (let pair of formData.entries()) {
    const key = pair[0];
    const value = pair[1];

    if (formDataObject[key]) {
      if (key === "billingFrequency") {
        formDataObject[key] = value;
      } else if (Array.isArray(formDataObject[key])) {
        formDataObject[key].push(value);
      } else {
        formDataObject[key] = [formDataObject[key], value];
      }
    } else {
      formDataObject[key] = value;
    }
  }

  // TODO set up UI function that can be called to move to form submission complete state
  console.log(formDataObject);
}

// UI Logic

function createStepHandler() {
  let currentStep = 0;
  const steps = Array.from(document.querySelectorAll(".form__step"));
  const nextButton = document.getElementById("next-step-button");
  const backButton = document.getElementById("previous-step-button");
  const submitButton = document.getElementById("submit-button");
  const mobileStepCounterItems = Array.from(document.querySelectorAll(".step-indicator__number"));

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

    // Update mobile step counter
    mobileStepCounterItems.forEach(item => item.classList.remove("step-indicator__active"));
    mobileStepCounterItems.forEach(item => parseInt(item.innerHTML) === currentStep + 1 ? item.classList.add("step-indicator__active") : null);
  }

  function getErrorMessage(input) {
    if (input.validity.valueMissing) {
      return 'This field is required.';
    } else if (input.validity.typeMismatch) {
      return 'Please enter a valid value.';
    } else if (input.validity.patternMismatch) {
      return 'Please match the requested format.';
    } else if (input.validity.tooLong) {
      return 'Please enter a shorter value.';
    } else if (input.validity.tooShort) {
      return 'Please enter a longer value.';
    } else if (input.validity.rangeUnderflow) {
      return 'Please enter a value greater than or equal to the minimum.';
    } else if (input.validity.rangeOverflow) {
      return 'Please enter a value less than or equal to the maximum.';
    } else if (input.validity.stepMismatch) {
      return 'Please enter a valid value.';
    } else if (input.validity.badInput) {
      return 'Please enter a valid value.';
    } else if (input.validity.customError) {
      return 'Please enter a valid value.';
    } else {
      return 'Please enter a valid value.';
    }
  }

  function stepIsValidated() {
    const step = steps[currentStep];
    const inputs = Array.from(step.querySelectorAll("input"));
    let isValid = true;

  inputs.forEach(input => {
    const formGroup = input.closest(".form__group");
    const errorMessageElement = formGroup ? formGroup.querySelector(".form__error-message") : null;

      if (!input.checkValidity()) {
        isValid = false;

        // Find the error message element and set its inner text to the validation error message
        if (errorMessageElement) {
          errorMessageElement.innerText = getErrorMessage(input);
        }
      } else {
        // If input is valid, clear any previous error message
        if (errorMessageElement) {
          errorMessageElement.innerText = "";
        }
      }
    });
  
    return isValid;
  }

  return {
    handleStepChange: (stepNumber) => {
      if (!stepIsValidated()) { return; }
      currentStep += stepNumber;
      currentStep = Math.max(0, Math.min(steps.length - 1, currentStep));
      updateFormUI();
    },
    getCurrentStep: () => currentStep
  };
};

function createBillingFrequencyHandler() {
  const toggleLabels = Array.from(document.querySelectorAll(".toggle-labels"));
  const freeMonthLabels = Array.from(document.querySelectorAll(".form__plan-card--free-months"));
  const arcadePriceLabel = document.getElementById("arcade-price");
  const advancedPriceLabel = document.getElementById("advanced-price");
  const proPriceLabel = document.getElementById("pro-price");
  const plans = new Plans();

  return function toggleBillingFrequencyChange() {
    let billingFrequency = document.getElementById("form__plan-toggle").checked ? "yearly" : "monthly";

    // Toggle active class on toggle labels and show 
    toggleLabels.forEach(label => label.classList.toggle("form__plan-toggle--active"));
    freeMonthLabels.forEach(label => label.classList.toggle("hidden"));

    // Update billing frequency plan values
    arcadePriceLabel.innerHTML = billingFrequency === "monthly" ? `$${plans.arcade.monthly}/mo` : `$${plans.arcade.yearly}/yr`;
    advancedPriceLabel.innerHTML = billingFrequency === "monthly" ? `$${plans.advanced.monthly}/mo` : `$${plans.advanced.yearly}/yr`;
    proPriceLabel.innerHTML = billingFrequency === "monthly" ? `$${plans.pro.monthly}/mo` : `$${plans.pro.yearly}/yr`;
  }
}


// TODO add event listener that stops form submission on enter key press unless on last step

// Wait till load to execute all code
window.addEventListener("load", function() {
  const stepHandler = createStepHandler();
  const billingFrequencyHandler = createBillingFrequencyHandler();

  document.getElementById("multi-step-form").addEventListener("submit", handleFormSubmit);
  document.getElementById("next-step-button").addEventListener("click", () => stepHandler.handleStepChange(1));
  document.getElementById("previous-step-button").addEventListener("click", () => stepHandler.handleStepChange(-1));
  document.getElementById("form__plan-toggle").addEventListener("change", billingFrequencyHandler);
});
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

class Addon {
  constructor(addonName) {
    switch (addonName) {
      case "Online service":
        this.name = "Online service";
        this.monthly = 1;
        this.yearly = 10;
        break;
      case "Larger storage":
        this.name = "Larger storage";
        this.monthly = 2;
        this.yearly = 20;
        break;
      case "Customizable profile":
        this.name = "Customizable profile";
        this.monthly = 2;
        this.yearly = 20;
        break;
      default:
        this.name = "Error";
        this.monthly = 0;
        this.yearly = 0;
    }
  }
}

function handleFormSubmit(event, stepHandler) {
  event.preventDefault();

  // Move form to next step
  stepHandler.handleStepChange(1);

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
  const plans = new Plans();
  // Buttons
  const nextButton = document.getElementById("next-step-button");
  const backButton = document.getElementById("previous-step-button");
  const submitButton = document.getElementById("submit-button");
  // Other UI elements
  const mobileStepCounterItems = Array.from(document.querySelectorAll(".step-indicator__number"));
  const formAddonList = document.getElementById("form__addon--list");
  const totalCostLabelElement = document.getElementById("form__total-label");
  const totalCostPriceElement = document.getElementById("form__total-price");
  const formTotalPlanLabel = document.getElementById("form__total-plan--label");
  const formTotalPlanCost = document.getElementById("form__total-plan--cost");
  const formButtons = document.getElementById("form__buttons");

  function createAddonFormRow(addon, billingFrequency) {
    // Create elements
    const div = document.createElement("div");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");

    // Set classes and text
    div.className = "form__total-addon--row";
    p1.textContent = addon.name;
    p2.className = "form__total-addon--price";
    p2.textContent = billingFrequency === "monthly" ? `+$${addon.monthly}/mo` : `+$${addon.yearly}/yr`;

    // Append p elements to div
    div.appendChild(p1);
    div.appendChild(p2);

    return div;
  }

  function handleSummaryStep() {
    // Set formAddonList to be empty before generating new addon list
    formAddonList.innerHTML = "";

    // Get billing frequency, selected plan, and selected addons
    let billingFrequency = document.getElementById("form__plan-toggle").checked ? "yearly" : "monthly";
    const isMonthly = billingFrequency === "monthly";
    const selectedAddonElements = document.querySelectorAll(".form__addon-input:checked");
    if (selectedAddonElements.length > 0) {
      const hrElement = document.createElement("hr");
      formAddonList.appendChild(hrElement);
    }
    const selectedPlan = document.querySelector(".form__plan-input:checked").value;

    // Create new addon list and total cost
    let totalCost = 0;
    selectedAddonElements.forEach(addonElement => {
      const newAddon = new Addon(addonElement.value);
      totalCost += isMonthly ? newAddon.monthly : newAddon.yearly;
      const addonRow = createAddonFormRow(newAddon, billingFrequency);
      formAddonList.appendChild(addonRow);
    });

    // Update total cost
    totalCost += isMonthly ? plans[selectedPlan].monthly : plans[selectedPlan].yearly;
    totalCostLabelElement.innerHTML = isMonthly ? "Total (per month)" : "Total (per year)";
    totalCostPriceElement.innerHTML = isMonthly ? `$${totalCost}/mo` : `$${totalCost}/yr`;
    switch (selectedPlan) {
      case "arcade":
        formTotalPlanLabel.innerHTML = isMonthly ? "Arcade (Monthly)" : "Arcade (Yearly)";
        formTotalPlanCost.innerHTML = isMonthly ? `$${plans.arcade.monthly}/mo` : `$${plans.arcade.yearly}/yr`;
        break;
      case "advanced":
        formTotalPlanLabel.innerHTML = isMonthly ? "Advanced (Monthly)" : "Advanced (Yearly)";
        formTotalPlanCost.innerHTML = isMonthly ? `$${plans.advanced.monthly}/mo` : `$${plans.advanced.yearly}/yr`;
        break;
      case "pro":
        formTotalPlanLabel.innerHTML = isMonthly ? "Pro (Monthly)" : "Pro (Yearly)";
        formTotalPlanCost.innerHTML = isMonthly ? `$${plans.pro.monthly}/mo` : `$${plans.pro.yearly}/yr`;
        break;
      default:
        formTotalPlanLabel.innerHTML = "Error";
    }
  }

  function updateFormUI() {
    // Hide all steps
    steps.forEach(step => step.classList.add("hidden"));

    // Show current step
    steps[currentStep].classList.remove("hidden");

    // Hide back button on first step and show on other steps
    backButton.style.display = currentStep === 0 ? "none" : "block";

    // Hide next button on last step and show on other steps
    nextButton.style.display = currentStep === steps.length - 2 ? "none" : "block";

    // Show submit button on last step and hide on other steps
    submitButton.style.display = currentStep === steps.length - 2 ? "block" : "none";

    // Update mobile step counter
    mobileStepCounterItems.forEach(item => item.classList.remove("step-indicator__active"));
    mobileStepCounterItems.forEach(item => parseInt(item.innerHTML) === currentStep + 1 ? item.classList.add("step-indicator__active") : null);

    // If on summary step update summary page UI with data from form
    if (currentStep === 3) {
      handleSummaryStep();
    }

    // Handle final form submission page
    if (currentStep === 4) {
      mobileStepCounterItems.forEach(item => parseInt(item.innerHTML) === currentStep ? item.classList.add("step-indicator__active") : null);
      formButtons.style.display = "none";
    }
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
          input.classList.add("input-error-border");
        }
      } else {
        // If input is valid, clear any previous error message
        if (errorMessageElement) {
          errorMessageElement.innerText = "";
          input.classList.remove("input-error-border");
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
    getCurrentStep: () => currentStep,
    jumpToStep: (stepNumber) => {
      currentStep = stepNumber;
      updateFormUI();
    }
  };
};

function createBillingFrequencyHandler() {
  const toggleLabels = Array.from(document.querySelectorAll(".toggle-labels"));
  const freeMonthLabels = Array.from(document.querySelectorAll(".form__plan-card--free-months"));
  const arcadePriceLabel = document.getElementById("arcade-price");
  const advancedPriceLabel = document.getElementById("advanced-price");
  const proPriceLabel = document.getElementById("pro-price");
  const onlineServicePrice = document.querySelector('label[for="online-service"] .form__addon-card--price');
  const largerStoragePrice = document.querySelector('label[for="larger-storage"] .form__addon-card--price');
  const customizableProfilePrice = document.querySelector('label[for="customizable-profile"] .form__addon-card--price');
  const plans = new Plans();

  return function toggleBillingFrequencyChange() {
    let billingFrequency = document.getElementById("form__plan-toggle").checked ? "yearly" : "monthly";
    const isMonthly = billingFrequency === "monthly";

    // Toggle active class on toggle labels and show 
    toggleLabels.forEach(label => label.classList.toggle("form__plan-toggle--active"));
    freeMonthLabels.forEach(label => label.classList.toggle("hidden"));

    // Update billing frequency plan values for each plan and update addons
    arcadePriceLabel.innerHTML = isMonthly ? `$${plans.arcade.monthly}/mo` : `$${plans.arcade.yearly}/yr`;
    advancedPriceLabel.innerHTML = isMonthly ? `$${plans.advanced.monthly}/mo` : `$${plans.advanced.yearly}/yr`;
    proPriceLabel.innerHTML = isMonthly ? `$${plans.pro.monthly}/mo` : `$${plans.pro.yearly}/yr`;
    onlineServicePrice.innerHTML = isMonthly ? `+$1/mo` : `+$10/yr`;
    largerStoragePrice.innerHTML = isMonthly ? `+$2/mo` : `+$20/yr`;
    customizableProfilePrice.innerHTML = isMonthly ? `+$2/mo` : `+$20/yr`;
  }
}

function handleAddonStyleEventListeners() {
  const addons = document.querySelectorAll(".form__addon-input");
  addons.forEach(addon => {
    addon.addEventListener("change", () => {
      const label = document.querySelector(`label[for="${addon.id}"]`);
      label.classList.toggle("active-addon", addon.checked);
    });
  })
}

// TODO add event listener that stops form submission on enter key press unless on last step

// Wait till load to execute all code
window.addEventListener("load", function() {
  const stepHandler = createStepHandler();
  const billingFrequencyHandler = createBillingFrequencyHandler();

  handleAddonStyleEventListeners();
  document.getElementById("multi-step-form").addEventListener("submit", (e) => handleFormSubmit(e, stepHandler));
  document.getElementById("next-step-button").addEventListener("click", () => stepHandler.handleStepChange(1));
  document.getElementById("previous-step-button").addEventListener("click", () => stepHandler.handleStepChange(-1));
  document.getElementById("form__plan-toggle").addEventListener("change", billingFrequencyHandler);
  document.getElementById("form__total-plan--button").addEventListener("click", () => stepHandler.jumpToStep(1));
});
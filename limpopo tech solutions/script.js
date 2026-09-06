/* =====================================================
   LIMPOPO TECH SOLUTIONS
   NC(V) COMPUTER PROGRAMMING LEVEL 4

   SUBTASK 3: FUNCTIONAL PROCESS ON A WEB APPLICATION

   This JavaScript demonstrates:
   1. Functions
   2. Parameters
   3. Local variables
   4. Conditional structures
   5. Iteration
   6. Input and output
   7. Arithmetic
   8. Validation
   9. Logical operators
   10. Return values
   11. Alert statements
   12. Events
===================================================== */

/* =====================================================
   FUNCTION 1: GET SERVICE PRICE
   Returns the base price of the selected service.
   Parameter: serviceCode
===================================================== */
function getServicePrice(serviceCode) {
    let price = 0;

    if (serviceCode === "repair") {
        price = 250;
    } else if (serviceCode === "network") {
        price = 350;
    } else if (serviceCode === "web") {
        price = 1500;
    } else if (serviceCode === "support") {
        price = 200;
    } else {
        price = 0;
    }

    return price;
}

/* =====================================================
   FUNCTION 2: VALIDATE USER INPUT
   Checks whether the information entered by the
   customer is valid.
   Parameters: name, email, service, devices
===================================================== */
function validateInput(name, email, service, devices) {
    if (name.trim().length < 3) {
        return "Please enter a valid full name.";
    }

    if (!email.includes("@") || !email.includes(".")) {
        return "Please enter a valid email address.";
    }

    if (service === "") {
        return "Please select a service.";
    }

    if (devices < 1 || devices > 20) {
        return "Number of devices must be between 1 and 20.";
    }

    return "";
}

/* =====================================================
   FUNCTION 3: CALCULATE QUOTE
   Calculates the final estimated price with optional
   volume discount.
   Parameters: basePrice, devices, urgency, onsite
===================================================== */
function calculateQuote(basePrice, devices, urgency, onsite) {
    let total = basePrice * devices;

    // Volume discount: 10% for 10 or more devices
    if (devices >= 10) {
        total = total * 0.9;
    }

    if (urgency === "urgent") {
        total = total * 1.20;
    }

    if (onsite === true) {
        total = total + 150;
    }

    return total;
}

/* =====================================================
   FUNCTION 4: BUILD SUMMARY
   Creates an HTML summary with price breakdown.
   Parameters: serviceText, devices, basePrice, urgency, onsite, total
===================================================== */
function buildSummary(serviceText, devices, basePrice, urgency, onsite, total) {
    const subtotal = basePrice * devices;
    const discount = (devices >= 10) ? (subtotal * 0.10) : 0;
    const discountedSubtotal = subtotal - discount;
    const urgencySurcharge = (urgency === "urgent") ? (discountedSubtotal * 0.20) : 0;
    const onsiteFee = onsite ? 150 : 0;

    const items = [
        "Service: " + serviceText,
        "Number of devices: " + devices,
        "Base price per device: R" + basePrice.toFixed(2),
        "Subtotal: R" + subtotal.toFixed(2),
    ];

    if (discount > 0) {
        items.push("Volume discount (10%): -R" + discount.toFixed(2));
    }

    items.push("Urgency: " + urgency);
    if (urgencySurcharge > 0) {
        items.push("Urgency surcharge (20%): +R" + urgencySurcharge.toFixed(2));
    }

    items.push("On-site visit: " + (onsite ? "Yes (+R" + onsiteFee.toFixed(2) + ")" : "No"));

    let summary = "<ul>";
    for (let i = 0; i < items.length; i++) {
        summary += "<li>" + items[i] + "</li>";
    }
    summary += "</ul>";

    return summary;
}

/* =====================================================
   FUNCTION 5: MARK ERRORS
   Adds error class to input fields for visual feedback.
===================================================== */
function markError(elementId, isError) {
    const element = document.getElementById(elementId);
    if (element) {
        if (isError) {
            element.classList.add("input-error");
        } else {
            element.classList.remove("input-error");
        }
    }
}

/* =====================================================
   FUNCTION 6: HANDLE QUOTE
   Reads customer input, validates, calculates and displays.
===================================================== */
function handleQuote() {
    // Clear previous error states
    const fields = ["customerName", "email", "service", "devices"];
    fields.forEach(field => markError(field, false));

    const name = document.getElementById("customerName").value;
    const email = document.getElementById("email").value;
    const serviceElement = document.getElementById("service");
    const service = serviceElement.value;
    const devices = Number(document.getElementById("devices").value);
    const onsite = document.getElementById("onsite").checked;
    const urgency = document.querySelector('input[name="urgency"]:checked').value;
    const result = document.getElementById("result");

    const validationMessage = validateInput(name, email, service, devices);

    if (validationMessage !== "") {
        // Highlight fields with errors (simplified: highlight all fields if any error)
        if (name.trim().length < 3) markError("customerName", true);
        if (!email.includes("@") || !email.includes(".")) markError("email", true);
        if (service === "") markError("service", true);
        if (devices < 1 || devices > 20) markError("devices", true);

        alert(validationMessage);
        result.innerHTML = "<strong>" + validationMessage + "</strong>";
        return;
    }

    const basePrice = getServicePrice(service);
    const total = calculateQuote(basePrice, devices, urgency, onsite);
    const serviceText = serviceElement.options[serviceElement.selectedIndex].text;
    const summary = buildSummary(serviceText, devices, basePrice, urgency, onsite, total);

    result.innerHTML =
        "<h3>Quote for " + name + "</h3>" +
        summary +
        "<p><strong>Estimated Total: R" + total.toFixed(2) + "</strong></p>";
}

/* =====================================================
   FUNCTION 7: SUBMIT BOOKING
   Validates and shows confirmation. Calls handleQuote to ensure quote is displayed.
===================================================== */
function submitBooking() {
    // Ensure quote is calculated (will also validate and show errors)
    handleQuote();

    const name = document.getElementById("customerName").value;
    const email = document.getElementById("email").value;
    const service = document.getElementById("service").value;
    const devices = Number(document.getElementById("devices").value);

    const message = validateInput(name, email, service, devices);
    if (message !== "") {
        alert(message);
        return;
    }

    // If validation passed, quote was calculated and displayed
    alert(
        "Thank you, " + name + "!\n\nYour booking request has been recorded.\n\nWe will contact you using your email address."
    );
}

/* =====================================================
   EVENT INTEGRATION (with DOMContentLoaded wrapper)
===================================================== */
document.addEventListener("DOMContentLoaded", function () {
    const calculateBtn = document.getElementById("calculateBtn");
    const submitBtn = document.getElementById("submitBtn");

    if (calculateBtn) {
        calculateBtn.addEventListener("click", handleQuote);
    }

    if (submitBtn) {
        submitBtn.addEventListener("click", submitBooking);
    }
});
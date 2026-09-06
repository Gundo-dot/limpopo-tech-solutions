/* =====================================================
   LIMPOPO TECH SOLUTIONS
   NC(V) COMPUTER PROGRAMMING LEVEL 4
   Professional JavaScript
   ===================================================== */

/* -----------------------------------------------------
   Function: getServicePrice
   Returns the base price for the selected service code.
   Parameter: serviceCode (string)
   Returns: number
----------------------------------------------------- */
function getServicePrice(serviceCode) {
    switch (serviceCode) {
        case 'repair':
            return 250;
        case 'network':
            return 350;
        case 'web':
            return 1500;
        case 'support':
            return 200;
        default:
            return 0;
    }
}

/* -----------------------------------------------------
   Function: validateInput
   Validates customer input fields.
   Parameters: name, email, service, devices
   Returns: error message string (empty if valid)
----------------------------------------------------- */
function validateInput(name, email, service, devices) {
    if (name.trim().length < 3) {
        return 'Please enter a valid full name.';
    }

    if (!email.includes('@') || !email.includes('.')) {
        return 'Please enter a valid email address.';
    }

    if (service === '') {
        return 'Please select a service.';
    }

    if (devices < 1 || devices > 20) {
        return 'Number of devices must be between 1 and 20.';
    }

    return '';
}

/* -----------------------------------------------------
   Function: calculateQuote
   Calculates the final estimated price.
   Parameters: basePrice, devices, urgency, onsite
   Returns: number (total)
----------------------------------------------------- */
function calculateQuote(basePrice, devices, urgency, onsite) {
    let total = basePrice * devices;

    // Volume discount: 10% for 10 or more devices
    if (devices >= 10) {
        total *= 0.9;
    }

    // Urgent service surcharge: +20%
    if (urgency === 'urgent') {
        total *= 1.20;
    }

    // On-site visit fee
    if (onsite) {
        total += 150;
    }

    return total;
}

/* -----------------------------------------------------
   Function: buildSummary
   Creates an HTML breakdown of the quote.
   Parameters: serviceText, devices, basePrice, urgency, onsite, total
   Returns: HTML string
----------------------------------------------------- */
function buildSummary(serviceText, devices, basePrice, urgency, onsite, total) {
    const subtotal = basePrice * devices;
    const discount = (devices >= 10) ? subtotal * 0.10 : 0;
    const discountedSubtotal = subtotal - discount;
    const urgencySurcharge = (urgency === 'urgent') ? discountedSubtotal * 0.20 : 0;
    const onsiteFee = onsite ? 150 : 0;

    const items = [
        `Service: ${serviceText}`,
        `Number of devices: ${devices}`,
        `Base price per device: R${basePrice.toFixed(2)}`,
        `Subtotal: R${subtotal.toFixed(2)}`,
    ];

    if (discount > 0) {
        items.push(`Volume discount (10%): -R${discount.toFixed(2)}`);
    }

    items.push(`Urgency: ${urgency}`);
    if (urgencySurcharge > 0) {
        items.push(`Urgency surcharge (20%): +R${urgencySurcharge.toFixed(2)}`);
    }

    items.push(`On-site visit: ${onsite ? `Yes (+R${onsiteFee.toFixed(2)})` : 'No'}`);

    let html = '<ul>';
    for (let i = 0; i < items.length; i++) {
        html += `<li>${items[i]}</li>`;
    }
    html += '</ul>';

    return html;
}

/* -----------------------------------------------------
   Function: markError
   Toggles the error class on a form field.
   Parameters: elementId (string), isError (boolean)
----------------------------------------------------- */
function markError(elementId, isError) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('input-error', isError);
    }
}

/* -----------------------------------------------------
   Function: clearErrors
   Removes error class from all form fields.
----------------------------------------------------- */
function clearErrors() {
    const fields = ['customerName', 'email', 'service', 'devices'];
    fields.forEach(field => markError(field, false));
}

/* -----------------------------------------------------
   Function: handleQuote
   Main handler for the Calculate Quote button.
   Reads input, validates, calculates, and displays result.
----------------------------------------------------- */
function handleQuote() {
    // Clear previous error highlights
    clearErrors();

    // Read input values
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('email').value;
    const serviceElement = document.getElementById('service');
    const service = serviceElement.value;
    const devices = Number(document.getElementById('devices').value);
    const onsite = document.getElementById('onsite').checked;
    const urgency = document.querySelector('input[name="urgency"]:checked').value;
    const result = document.getElementById('result');

    // Validate
    const validationMessage = validateInput(name, email, service, devices);
    if (validationMessage !== '') {
        // Highlight invalid fields
        if (name.trim().length < 3) markError('customerName', true);
        if (!email.includes('@') || !email.includes('.')) markError('email', true);
        if (service === '') markError('service', true);
        if (devices < 1 || devices > 20) markError('devices', true);

        alert(validationMessage);
        result.innerHTML = `<strong>${validationMessage}</strong>`;
        return;
    }

    // Calculate quote
    const basePrice = getServicePrice(service);
    const total = calculateQuote(basePrice, devices, urgency, onsite);

    // Get selected service text
    const serviceText = serviceElement.options[serviceElement.selectedIndex].text;

    // Build summary HTML
    const summary = buildSummary(serviceText, devices, basePrice, urgency, onsite, total);

    // Display result
    result.innerHTML = `
        <h3>Quote for ${name}</h3>
        ${summary}
        <p><strong>Estimated Total: R${total.toFixed(2)}</strong></p>
    `;
}

/* -----------------------------------------------------
   Function: submitBooking
   Handles the Submit Booking button.
   Ensures quote is calculated, then shows confirmation.
----------------------------------------------------- */
function submitBooking() {
    // Ensure quote calculation (also validates)
    handleQuote();

    // Re-check validation without double-displaying alerts
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('email').value;
    const service = document.getElementById('service').value;
    const devices = Number(document.getElementById('devices').value);

    const message = validateInput(name, email, service, devices);
    if (message !== '') {
        // Error already displayed by handleQuote; just return
        return;
    }

    alert(
        `Thank you, ${name}!\n\n` +
        'Your booking request has been recorded.\n\n' +
        `We will contact you using your email address (${email}).`
    );
}

/* -----------------------------------------------------
   Event Listeners (wrapped in DOMContentLoaded)
----------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    const calculateBtn = document.getElementById('calculateBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleQuote);
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', submitBooking);
    }
});
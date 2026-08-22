<?php
/**
 * get-quote-handler.php
 * Handles the "Get A Quote" popup form that appears on every page.
 * Emails the submission straight to gabriellef@healthsecuresolution.com.
 *
 * Requires real PHP hosting to run (works on Namecheap shared hosting by
 * default once uploaded — will NOT work opened locally as a file:// page).
 */

$to = "gabriellef@healthsecuresolution.com";

function clean_field($value) {
    $value = trim($value ?? '');
    // Strip line breaks so nobody can inject extra email headers via a form field.
    return str_replace(array("\r", "\n"), '', $value);
}

$name          = clean_field($_POST['name'] ?? '');
$coverage_type = clean_field($_POST['coverage_type'] ?? '');
$email         = clean_field($_POST['email'] ?? '');
$phone         = clean_field($_POST['phone'] ?? '');
$message       = trim($_POST['message'] ?? '');

// Basic required-field + email sanity check.
if ($name === '' || $coverage_type === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Please go back and fill out your name, coverage type, and a valid email.";
    exit;
}

$email_subject = "New quote request from " . $name . " (" . ucfirst($coverage_type) . ")";

$body  = "New \"Get A Quote\" request submitted on healthsecuresolution.com:\n\n";
$body .= "Name: " . $name . "\n";
$body .= "Coverage Type: " . ucfirst($coverage_type) . "\n";
$body .= "Email: " . $email . "\n";
$body .= "Phone: " . ($phone !== '' ? $phone : "(not provided)") . "\n\n";
$body .= "What they're looking for:\n" . ($message !== '' ? $message : "(not provided)") . "\n";

$headers   = array();
$headers[] = "From: Health Secure Solution Website <website@healthsecuresolution.com>";
$headers[] = "Reply-To: " . $email;
$headers[] = "Content-Type: text/plain; charset=UTF-8";

$sent = @mail($to, $email_subject, $body, implode("\r\n", $headers));

if ($sent) {
    header("Location: thank-you.html");
    exit;
} else {
    http_response_code(500);
    echo "Sorry, something went wrong sending your request. Please email gabriellef@healthsecuresolution.com directly, or call 603 233 5480.";
    exit;
}

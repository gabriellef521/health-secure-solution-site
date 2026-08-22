<?php
/**
 * send-message-handler.php
 * Handles the "Send Us A Message" form on contact.html.
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

$first_name = clean_field($_POST['first_name'] ?? '');
$last_name  = clean_field($_POST['last_name'] ?? '');
$email      = clean_field($_POST['email'] ?? '');
$phone      = clean_field($_POST['phone'] ?? '');
$subject    = clean_field($_POST['subject'] ?? '');
$message    = trim($_POST['message'] ?? '');

// Basic required-field + email sanity check.
if ($first_name === '' || $email === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Please go back and fill out your name, a valid email, and a message.";
    exit;
}

$email_subject = "New website message from " . $first_name . " " . $last_name;

$body  = "New message submitted through the Contact Us form on healthsecuresolution.com:\n\n";
$body .= "Name: " . $first_name . " " . $last_name . "\n";
$body .= "Email: " . $email . "\n";
$body .= "Phone: " . ($phone !== '' ? $phone : "(not provided)") . "\n";
$body .= "Subject: " . ($subject !== '' ? $subject : "(none)") . "\n\n";
$body .= "Message:\n" . $message . "\n";

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
    echo "Sorry, something went wrong sending your message. Please email gabriellef@healthsecuresolution.com directly, or call 603 233 5480.";
    exit;
}

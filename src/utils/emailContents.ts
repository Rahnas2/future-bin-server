

export function registerRequestApproved(name: string): string {
    return `<p>Dear <strong>${name}</strong>,</p>
<p>We are thrilled to inform you that your registration as a waste collector on <strong>FUTURE BIN</strong> has been <strong>approved</strong>! 🎉</p>
<p>You can now start accepting waste collection requests and contribute to a cleaner environment.</p>
<p><strong>Next Steps:</strong></p>
<ul>
    <li>✔️ <a href="#">Log in to your account</a></li>
    <li>✔️ Update your profile if needed</li>
    <li>✔️ Start accepting collection requests</li>
</ul>
<p>Thank you for joining us in our mission to promote responsible waste management!</p>
<p>Best Regards,<br>
<strong>FUTURE BIN Team</strong><br>
<a href="#">supportfuturebin@gmail.com]</a> | <a href="#">www.futurebin.com</a></p>`
}

export function registerRequestRejected(name: string): string {
    return `<p>Dear <strong>${name}</strong>,</p>
           <p>Thank you for applying to be a waste collector on <strong>FUTURE BIN</strong>.</p>
           <p>After careful review, we regret to inform you that your application <strong>has not been approved</strong> at this time.</p>
           <p><strong>Possible reasons for rejection:</strong></p>
           <ul>
               <li>🔹 Incomplete or incorrect documents</li>
               <li>🔹 Not meeting the eligibility criteria</li>
           </ul>
           <p>If you believe this was a mistake or wish to reapply, please review the requirements and submit your application again here: <a href="#">Reapply Now</a>.</p>
           <p>For further assistance, you can reach out to our support team.</p>
           <p>Best Regards,<br>
           <strong>FUTURE BIN Team</strong><br>
           <a href="#">supportfuturebin@gmail.com</a> | <a href="#">www.futurebin.com</a></p>`
}
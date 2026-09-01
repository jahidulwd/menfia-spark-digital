INSERT INTO public.pages (slug, title, seo_description, content, published, show_in_footer, sort_order) VALUES
('terms-and-conditions','Terms and Conditions','The terms that govern the use of Menfia Digital services and digital products.',
'1. Agreement
By using the Menfia Digital website or purchasing any digital product or service, you agree to these terms.

2. Digital products
Themes, templates, plugins and scripts are licensed, not sold. Each purchase grants one licence for one end project unless the product page states otherwise. Redistribution or resale of files is not permitted.

3. Services
Custom development and marketing engagements are scoped in a written proposal. Work begins after the proposal is accepted and any agreed deposit is received.

4. Payments
Payments are processed by Paddle, our merchant of record. Applicable taxes are calculated and collected by Paddle at checkout.

5. Delivery
Digital products are delivered immediately after successful payment through your account download area and the email you provide at checkout.

6. Support
Product support covers installation issues and defects for the period stated on the product page. Customisation is quoted separately.

7. Liability
Menfia Digital is not liable for indirect or consequential loss arising from the use of our products or services.

8. Changes
We may update these terms. The version published on this page at the time of your purchase applies to that purchase.

9. Contact
Questions about these terms: jahidulwd@gmail.com', true, true, 1),
('privacy-policy','Privacy Policy','How Menfia Digital collects, uses and protects your personal information.',
'1. Information we collect
We collect the name, email address and project details you submit through our contact form, and the email address and billing details required to complete a purchase.

2. How we use it
Your information is used to reply to enquiries, deliver purchased products, provide support, issue receipts, and meet legal and tax obligations.

3. Payment data
Payments are handled by Paddle. We never see or store your full card details.

4. Storage and security
Data is stored in a managed database with access restricted to authorised administrators. Product files are stored privately and delivered through expiring links.

5. Sharing
We do not sell your data. We share it only with processors that make the service work, such as our payment provider and email provider.

6. Cookies
We use essential cookies to keep you signed in. Analytics, where enabled, is used in aggregate only.

7. Your rights
You may request a copy, correction or deletion of your personal data at any time by emailing jahidulwd@gmail.com.

8. Retention
Order and invoice records are retained as long as legally required. Contact enquiries are retained while relevant to an active or potential engagement.

9. Contact
Privacy questions: jahidulwd@gmail.com', true, true, 2),
('refund-policy','Refund Policy','When refunds are available for Menfia Digital digital products and services.',
'1. Digital products
Because files are delivered instantly, refunds are available within 14 days of purchase when the product is faulty, materially different from its description, or cannot be made to work with reasonable support.

2. Not eligible
Refunds are not available for change of mind after download, for lack of compatibility clearly stated on the product page, or where files have been modified or redistributed.

3. Services
Custom projects are refundable for work not yet started. Once a sprint has begun, completed work is invoiced and non-refundable; remaining unused budget is returned.

4. How to request
Email jahidulwd@gmail.com with your order reference and a short description of the problem. We aim to reply within one business day.

5. Processing
Approved refunds are issued by Paddle to the original payment method, typically within 5-10 business days.

6. Contact
Refund questions: jahidulwd@gmail.com', true, true, 3)
ON CONFLICT (slug) DO NOTHING;
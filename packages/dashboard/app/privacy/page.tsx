import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ClipCraftr - Privacy Policy',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="prose dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Last updated: June 1, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            At ClipCraftr ("we," "our," or "us"), we respect your privacy and are committed to
            protecting your personal information. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you use our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="mb-4">
            We collect several types of information from and about users of our Service, including:
          </p>

          <h3 className="text-xl font-semibold mb-2 mt-4">Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Account information (username, email, profile picture)</li>
            <li>Authentication data from third-party services (e.g., Discord)</li>
            <li>Communication preferences</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">Usage Data</h3>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Log data (IP address, browser type, pages visited)</li>
            <li>Device information</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We may use your information to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Provide, maintain, and improve our Service</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze usage and trends</li>
            <li>Detect, investigate, and prevent fraudulent transactions</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
          <p className="mb-4">We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Service providers who perform services on our behalf</li>
            <li>Business partners to offer you certain services</li>
            <li>
              Law enforcement or other government officials, in response to a verified request
            </li>
            <li>Other parties in connection with a business transaction</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to track activity on our Service and
            hold certain information. You can instruct your browser to refuse all cookies or to
            indicate when a cookie is being sent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            information. However, no method of transmission over the Internet or electronic storage
            is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Your Data Protection Rights</h2>
          <p className="mb-4">Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Access, update, or delete your information</li>
            <li>Rectify inaccurate or incomplete information</li>
            <li>Object to our processing of your personal data</li>
            <li>Request restriction of processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent</li>
          </ul>
          <p>To exercise these rights, please contact us.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p>
            Our Service is not intended for children under 13. We do not knowingly collect
            personally identifiable information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:jon@chron0.tech" className="text-blue-500 hover:underline">
              jon@chron0.tech
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

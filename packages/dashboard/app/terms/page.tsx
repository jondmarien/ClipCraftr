import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ClipCraftr - Terms of Service',
};

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="prose dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Last updated: June 1, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to ClipCraftr ("we," "our," or "us"). These Terms of Service ("Terms") govern
            your access to and use of the ClipCraftr website, services, and applications
            (collectively, the "Service").
          </p>
          <p>
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree
            with any part of these Terms, you may not access the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you must provide accurate and complete information.
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activities that occur under your account.
          </p>
          <p>
            You agree to notify us immediately of any unauthorized use of your account or any other
            security breaches.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Content</h2>
          <p className="mb-4">
            You retain ownership of any content you submit, post, or display on or through the
            Service ("User Content"). By submitting User Content, you grant us a worldwide,
            non-exclusive, royalty-free license to use, reproduce, modify, and display such content
            in connection with the Service.
          </p>
          <p>
            You are solely responsible for your User Content and the consequences of posting or
            publishing it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Prohibited Conduct</h2>
          <p className="mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Upload or transmit viruses or malicious code</li>
            <li>Interfere with the Service's operation</li>
            <li>Attempt to gain unauthorized access to any systems or networks</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately,
            without prior notice or liability, for any reason, including if you breach these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall ClipCraftr, nor its directors, employees, partners, agents, suppliers,
            or affiliates, be liable for any indirect, incidental, special, consequential, or
            punitive damages resulting from your access to or use of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms at any time. We will provide notice of any
            changes by updating the "Last updated" date at the top of these Terms. Your continued
            use of the Service after such modifications constitutes your acceptance of the revised
            Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at{' '}
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

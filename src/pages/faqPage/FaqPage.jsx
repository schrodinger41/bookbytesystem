import React from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import "./faqPage.css";

const FaqPage = () => {
  return (
    <div>
      <Header />
      <div className="faq-container">
        <h1>Frequently Asked Questions (FAQ)</h1>
        <p>
          Have questions? We've gathered the most common ones here to help you
          with your shopping experience at LabuLoveTreasures. For anything else,
          feel free to reach out at{" "}
          <a href="mailto:labulovetreasures@gmail.com">
            labulovetreasures@gmail.com
          </a>
          .
        </p>

        <section>
          <h2>ABOUT US</h2>
          <p>
            <strong>What is LabuLoveTreasures?</strong>
            <br />
            LabuLoveTreasures is your trusted destination for authentic Labubu
            collectibles. We specialize in curating rare, limited-edition
            figures and exclusive releases straight from the heart of the Labubu
            universe.
          </p>

          <p>
            <strong>Where are you based?</strong>
            <br />
            <span>Head Office:</span> Arlington, VA 22203
          </p>
        </section>

        <section>
          <h2>SHIPPING & DELIVERY</h2>
          <p>
            <strong>Where are the orders shipped from?</strong>
            <br />
            All products are dispatched from () to ensure prompt delivery across
            the globe.
          </p>

          <p>
            <strong>Do you ship internationally?</strong>
            <br />
            Yes! We deliver to most countries worldwide.
          </p>

          <p>
            <strong>When will I get my order?</strong>
            <br />
            Delivery times depend on your location. You'll receive an email with
            tracking info once your package is on the way.
          </p>

          <p>
            <strong>Can I check the delivery status?</strong>
            <br />
            Absolutely! We'll send a tracking link to your email once your order
            ships.
          </p>
        </section>

        <section>
          <h2>PAYMENTS</h2>
          <p>
            <strong>Which payment options are available?</strong>
            <br />
            We accept:
            <ul>
              <li>Zelle</li>
              <li>Venmo</li>
              <li>PayPal</li>
            </ul>
          </p>
        </section>

        <section>
          <h2>PRIVACY & SECURITY</h2>
          <p>
            <strong>What data do you collect?</strong>
            <br />
            We collect necessary details like your name, contact info, shipping
            address, and payment data.
          </p>

          <p>
            <strong>How is my information protected?</strong>
            <br />
            Your security is important to us. We use secure payment gateways to
            protect your data and never share it with third parties.
          </p>
        </section>

        <section>
          <h2>FOR PARENTS</h2>
          <p>
            <strong>Is the site safe for kids?</strong>
            <br />
            LabuLoveTreasures is designed for users aged 18 and up. We do not
            knowingly collect information from minors.
          </p>
        </section>

        <section>
          <h2>CHANGES & CANCELLATIONS</h2>
          <p>
            <strong>Can I cancel or change my order?</strong>
            <br />
            If you need to make changes or cancel, please contact us within 24
            hours of placing your order at{" "}
            <a href="mailto:labulovetreasures@gmail.com">
              labulovetreasures@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2>CONTACT DETAILS</h2>
          <p>
            <strong>Brand:</strong> LabuLoveTreasures
            <br />
            <strong>Office:</strong> Arlington, VA 22203
            <br />
            <strong>Business Hours:</strong> Monday–Friday, 9:00 AM to 9:00 PM
            USA (GMT-4) Eastern Standard Time (EST)
            <br />
            <strong>Contact Number:</strong> 925-727-3630
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:labulovetreasures@gmail.com">
              labulovetreasures@gmail.com
            </a>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default FaqPage;

import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

interface EmailData {
  name: string;
  company?: string;
  phone?: string;
  email: string;
  message: string;
}

interface VacancyApplicationData {
  name: string;
  email: string;
  phone?: string;
  vacancy: {
    id: string;
    title: string;
  };
  message?: string;
  cvFileUrl: string;
}

interface SubscriptionData {
  email: string;
  timestamp?: FirebaseFirestore.FieldValue;
}

export const sendEmail = functions.https.onCall(
  {
    secrets: ["EMAIL_USER", "EMAIL_PASSWORD"],
  },
  async (request: functions.https.CallableRequest<EmailData>) => {
    try {
      const data = request.data;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "kyryl.hnapovskyi@intresmartsolution.com",
        copy: "yakovenko.oleksandr@intresmartgroup.com",
        replyTo: data.email,
        subject: `New Contact Form Submission from ${data.name}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            ${
  data.company
    ? `<p><strong>Company:</strong> ${data.company}</p>`
    : ""
}
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
          `,
      };

      await transporter.sendMail(mailOptions);

      await admin
        .firestore()
        .collection("contact-submissions")
        .add({
          ...data,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

      return {success: true, message: "Email sent successfully"};
    } catch (error) {
      console.error("Error sending email:", error);
      throw new functions.https.HttpsError("internal", "Error sending email");
    }
  }
);

export const sendVacancyApplication = functions.https.onCall(
  {
    secrets: ["EMAIL_USER", "EMAIL_PASSWORD"],
  },
  async (request: functions.https.CallableRequest<VacancyApplicationData>) => {
    try {
      const data = request.data;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "kyryl.hnapovskyi@intresmartsolution.com",
        copy: "yakovenko.oleksandr@intresmartgroup.com",
        replyTo: data.email,
        subject: `New Job Application for ${data.vacancy.title}`,
        html: `
          <h2>New Job Application</h2>
          <p><strong>Position:</strong> ${data.vacancy.title}</p>
          <p><strong>Applicant Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
          ${
  data.message
    ? `<p><strong>Message:</strong></p><p>${data.message}</p>`
    : ""
}
          <p><strong>CV:</strong> <a href="${
  data.cvFileUrl
}">Download CV</a></p>
        `,
      };

      await transporter.sendMail(mailOptions);

      await admin
        .firestore()
        .collection("vacancy-applications")
        .add({
          ...data,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          status: "new",
        });

      return {success: true, message: "Application sent successfully"};
    } catch (error) {
      console.error("Error sending application:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Error sending application"
      );
    }
  }
);

export const subscribeToNewsletter = functions.https.onCall(
  {
    secrets: ["EMAIL_USER", "EMAIL_PASSWORD"],
  },
  async (request: functions.https.CallableRequest<SubscriptionData>) => {
    try {
      const data = request.data;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // Email to admin
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: "kyryl.hnapovskyi@intresmartsolution.com",
        copy: "yakovenko.oleksandr@intresmartgroup.com",
        subject: "New Newsletter Subscription",
        html: `
          <h2>New Newsletter Subscription</h2>
          <p>New subscriber: ${data.email}</p>
          <p>Date: ${new Date().toLocaleString()}</p>
        `,
      };

      // Confirmation email to subscriber
      const subscriberMailOptions = {
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: "Welcome to IntreSmart Newsletter",
        html: `
          <h2>Thank you for subscribing!</h2>
          <p>You've successfully subscribed to IntreSmart Group Company newsletter.</p>
          <p>You'll now receive our latest news and updates.</p>
        `,
      };

      // Send both emails
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(subscriberMailOptions),
      ]);

      // Save to Firebase
      await admin.firestore().collection("newsletter-subscribers").add({
        email: data.email,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        status: "active",
      });

      return {
        success: true,
        message: "Successfully subscribed to newsletter",
      };
    } catch (error) {
      console.error("Error processing subscription:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Error processing subscription"
      );
    }
  }
);

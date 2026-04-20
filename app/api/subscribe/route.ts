import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

const FROM = "StackItUp <hello@stackitup.app>";

function welcomeEmailHtml(firstName: string) {
  const name = firstName.replace(/[<>&"']/g, "");
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#15123A;font-family:'Helvetica Neue',Arial,sans-serif;color:#E9D5FF;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#15123A;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#1E1B4B;border:4px solid #D946EF;box-shadow:8px 8px 0 #06B6D4;">
            <tr>
              <td style="padding:32px 32px 0 32px;">
                <p style="margin:0;font-family:'Courier New',monospace;letter-spacing:0.3em;font-size:12px;text-transform:uppercase;color:#FBBF24;">Welcome aboard</p>
                <h1 style="margin:12px 0 0 0;font-size:32px;line-height:1.1;color:#ffffff;font-weight:900;letter-spacing:-0.5px;">
                  Hey ${name || "there"} — you're in.
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 8px 32px;font-size:16px;line-height:1.6;color:#E9D5FF;">
                <p style="margin:0 0 16px 0;">
                  Thanks for joining <strong style="color:#FBBF24;">StackItUp</strong>. Expect boring, reliable science on supplements, training, and recovery — no spam, no hype.
                </p>
                <p style="margin:0 0 24px 0;">
                  While you're here, the fastest way to get value is to take the 6-question quiz. It'll turn your goals into a tailored stack in under a minute.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 32px 8px 32px;">
                <a href="https://stackitup.app/quiz"
                   style="display:inline-block;background:#D946EF;color:#ffffff;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;font-size:16px;padding:16px 28px;border:4px solid #FBBF24;box-shadow:6px 6px 0 #06B6D4;text-decoration:none;">
                  Take the quiz →
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;font-size:14px;line-height:1.6;color:#E9D5FF;opacity:0.8;">
                <p style="margin:0 0 8px 0;">Or browse the library: <a href="https://stackitup.app/supplements" style="color:#06B6D4;">stackitup.app/supplements</a></p>
                <p style="margin:16px 0 0 0;font-size:12px;color:#E9D5FF;opacity:0.6;">
                  You're receiving this because you subscribed at stackitup.app. Reply to this email any time — a human reads it.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function welcomeEmailText(firstName: string) {
  const name = firstName || "there";
  return `Hey ${name} — you're in.

Thanks for joining StackItUp. Expect boring, reliable science on supplements, training, and recovery — no spam, no hype.

The fastest way to get value: take the 6-question quiz. It turns your goals into a tailored stack in under a minute.

Take the quiz: https://stackitup.app/quiz
Browse the library: https://stackitup.app/supplements

Reply to this email any time — a human reads it.`;
}

export async function POST(req: Request) {
  try {
    let body: { email?: string; firstName?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const email = body.email?.trim().toLowerCase();
    const firstName = body.firstName?.trim() ?? "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!firstName) {
      return NextResponse.json({ error: "Missing first name" }, { status: 400 });
    }

    const supabase = await getServerSupabase();
    const { error: dbError } = await supabase
      .from("subscribers")
      .insert({ email, first_name: firstName, source: "newsletter" });

    const alreadySubscribed = dbError?.code === "23505";
    if (dbError && !alreadySubscribed) {
      console.error("subscribers insert failed", dbError);
      return NextResponse.json(
        { error: "Could not save subscription", detail: dbError.message },
        { status: 500 },
      );
    }

    if (alreadySubscribed) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        const sendResult = await resend.emails.send({
          from: FROM,
          to: email,
          subject: `Welcome to StackItUp, ${firstName} 👋`,
          html: welcomeEmailHtml(firstName),
          text: welcomeEmailText(firstName),
        });
        if (sendResult.error) {
          console.error("Resend send error", sendResult.error);
        }

        const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID;
        if (audienceId) {
          const contactResult = await resend.contacts.create({
            email,
            firstName,
            audienceId,
            unsubscribed: false,
          });
          if (contactResult.error) {
            console.error("Resend contacts.create error", contactResult.error);
          }
        }
      } catch (err) {
        console.error("Resend welcome email threw", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/subscribe unhandled", err);
    return NextResponse.json(
      { error: "Server error", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

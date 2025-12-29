export default function html({
  url,
  host,
  email,
}: {
  url: string;
  host: string;
  email: string;
}) {

  // const protocol = url.startsWith("https") ? "https" : "http";
  const logoUrl = `http://localhost:3000/ChalkItUp_White_Logo.png`; 

  const siteName = host.split("//").pop();

  return `
     <body style="background: #e6e6e6; font-family: sans-serif;">
      <div style=margin: 0 auto; background: #222121; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <header style="background: #222121; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;">
          <img src="${logoUrl}" alt="ChalkItUp Logo" width="100" height"100">
        </header>
        <main style="padding: 30px;">
          <h2 style="color: #222121; margin-top: 0;">Sign In to ChalkItUp</h2>
          <p style="color: #222121; font-size: 16px;">
            Click the button below to sign in instantly to your account. This link will expire shortly.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" target="_blank" style="
              background-color: #222121; 
              color: e6e6e6; 
              padding: 12px 25px; 
              border-radius: 4px; 
              text-decoration: none; 
              font-weight: bold;
              font-size: 16px;
              display: inline-block;
            ">
              Sign In
            </a>
          </div>
          <p style="color: #888; font-size: 14px; text-align: center;">
            If you did not request this email, you can safely ignore it.
          </p>
          <p style="color: #888; font-size: 12px; text-align: center; text-decoration: none; ">
            <a href="${url}" style="color: #888; word-break: break-all;">ChalkItUp.com</a>
          </p>
        </main>
      </div>
    </body>
  `;
}

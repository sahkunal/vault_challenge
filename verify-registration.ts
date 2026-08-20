import * as anchor from "@anchor-lang/core";
import { Connection, PublicKey } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

const REGISTRATION_PROGRAM_ID = new PublicKey(
  "TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM"
);

async function main() {
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const walletPath = path.join(
    process.env.HOME || "",
    ".config/solana/id.json"
  );
  const secretKey = Uint8Array.from(
    JSON.parse(fs.readFileSync(walletPath, "utf-8"))
  );
  const wallet = anchor.web3.Keypair.fromSecretKey(secretKey);

  console.log("Wallet:", wallet.publicKey.toBase58());

  const [applicationAccountPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("prereqs"), wallet.publicKey.toBuffer()],
    REGISTRATION_PROGRAM_ID
  );

  console.log("Application account PDA:", applicationAccountPda.toBase58());

  const idl = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "idls", "registration.json"),
      "utf-8"
    )
  );

  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    { commitment: "confirmed" }
  );
  const program = new anchor.Program(idl, provider);

  const account = await (program.account as any).applicationAccount.fetch(
    applicationAccountPda
  );

  console.log("\n=== Registered details ===");
  console.log("user:       ", account.user.toBase58());
  console.log("bump:       ", account.bump);
  console.log("pre_req_ts: ", account.preReqTs);
  console.log("pre_req_rs: ", account.preReqRs);
  console.log("github:     ", account.github);
}

main().catch((err) => {
  console.error("Failed to fetch/verify registration:", err);
  process.exit(1);
});

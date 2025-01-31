import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const UserButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogOut = async () => {
    await signOut({
      redirect: false,
    });
    router.push("/");
  };

  return (
    <nav>
      {session ? (
        <>
          <h2>{session.user.name}</h2>
          <button
            onClick={() => handleLogOut()}
            style={{ color: "red", fontSize: "20px", margin: "20px" }}
          >
            Log Out
          </button>
        </>
      ) : (
        <div>
          <button style={{ color: "blue", fontSize: "20px", margin: "20px" }}>
            <Link href="sign-in">Sign in</Link>
          </button>
          <button style={{ color: "blue", fontSize: "20px", margin: "20px" }}>
            <Link href="sign-up">Sign up</Link>
          </button>
        </div>
      )}
    </nav>
  );
};

export default UserButton;

import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Email", type: "text", placeholder: "email address" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    const res = await fetch('http://localhost:3000/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: credentials?.username,
                            password: credentials?.password
                        }),
                        
                    })
                    if(res.status === 200){
                        const user = await res.json()
                        return user
                    }
                } catch (error) {
                    return new Response(JSON.stringify({error: "wrong credentials"}), {
                        status:401,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user }
        },
        async session({ session, token }) {
            //@ts-ignore
            session.user = token
            return session
        }
    },
    pages: {
        signIn: "/",
    },
});


export { handler as GET, handler as POST }
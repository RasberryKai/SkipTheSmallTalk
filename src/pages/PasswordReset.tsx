import AuthContainer from "../components/authentication/AuthContainer"
import AuthHeader from "../components/authentication/AuthHeader"

export default function PasswordReset() {
    return (
        <AuthContainer onSubmit={() => {}}>
            <AuthHeader>Password Reset</AuthHeader>
        </AuthContainer>
    )
}

export interface UserSignInInformation {
    email: string;
    password: string;
}

export function validateSignin(values: UserSignInInformation) {
    const errors: Record<keyof UserSignInInformation, string> = {
        email: '',
        password: '',
    };

    // 이메일 유효성 검사 (정규표현식)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 비밀번호 유효성 검사 (8~20자)
    if (values.password.length < 8 || values.password.length > 20) {
        errors.password = '비밀번호는 8자에서 20자 사이여야 합니다.';
    }

    return errors;
}
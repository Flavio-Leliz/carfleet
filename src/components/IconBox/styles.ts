import { css, styled } from "styled-components/native";

export type SizeProps = 'small' | 'normal'

export type Props = {
    size: SizeProps
}

const variantSizeStyle = (size: SizeProps) => {
    return {
        small: css`
            width: 32px;
            height: 32px;
        `,
        normal: css`
            width: 46px;
            height: 46px;
        `
    }[size]
}

export const Container = styled.View<Props>`
    border-radius: 6px;
    background-color: ${({ theme }) => theme.COLORS.GRAY_700};
    justify-content: center;
    align-items: center;
    margin-right: 12px;

${({ size }) => variantSizeStyle(size)}
`

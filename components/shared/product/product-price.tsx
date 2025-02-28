import { cn } from "@/lib/utils";

interface Props {
    price: number
    className?: string
}

const ProductPrice = (props: Props) => {
    const { price, className } = props;
    const priceAsString = price.toFixed(2)
    const [intValue, floatValue] = priceAsString.split('.')

    return <p className={cn('text-2xl', className)}>
        <span className="text-xs align-super">$</span>{intValue}
        <span className="text-xs align-super">.{floatValue}</span>
    </p>
}

export default ProductPrice
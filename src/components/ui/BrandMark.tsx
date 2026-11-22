import Image from "next/image";

type BrandMarkProps = {
  size?: number;
};

export function BrandMark({ size = 32 }: BrandMarkProps) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      <Image
        src="/images/brand/orbit-static.png"
        alt="ONZEMIL Company"
        fill
        className="object-contain motion-safe:hidden"
        priority
      />
      <Image
        src="/images/brand/orbit.gif"
        alt="ONZEMIL Company"
        fill
        className="object-contain motion-reduce:hidden"
        unoptimized
        priority
      />
    </span>
  );
}

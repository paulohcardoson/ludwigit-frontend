import { zodResolver } from "@hookform/resolvers/zod";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { HTTPError } from "ky";
import { Copy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

const schema = z.object({
	url: z.url("Please enter a valid URL"),
});

type FormValues = z.infer<typeof schema>;

function AdBanner() {
	return (
		<div className="flex flex-col items-center justify-center gap-1 h-[70px] py-2">
			<span className="text-[10px] font-medium tracking-[2px] text-[#AAAAAA]">
				Ad
			</span>
			<div className="w-[728px] h-[50px] rounded-lg bg-[#F5F5F5] border border-[#E0E0E0] flex items-center justify-center">
				<span className="text-xs text-[#AAAAAA]">Ad</span>
			</div>
		</div>
	);
}

function App() {
	const [, copy] = useCopyToClipboard();
	const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(data: FormValues) {
		try {
			const result = await api
				.post("create", { json: { url: data.url } })
				.text();
			setShortenedUrl(result.trim());
			toast.success("URL shortened!");
		} catch (e) {
			const error = e as HTTPError;
			const response = (await error.response.json()) as { message: string };

			toast.error(
				response.message || "Failed to shorten URL. Please try again.",
			);
		}
	}

	return (
		<div
			className="min-h-screen flex flex-col"
			style={{
				background:
					"radial-gradient(ellipse at center, #FAFAFA 0%, #F0F7F0 40%, #E8F1E8 70%, #DFF0DF 100%)",
			}}
		>
			<AdBanner />

			{/* Main content */}
			<div className="flex-1 flex items-center justify-center">
				<div className="flex flex-col items-center gap-2 w-120">
					{/* Logo + title */}
					<div className="flex flex-col items-center">
						<img
							src={logo}
							alt="Ludwigit logo"
							className="w-16 h-16"
							style={{ mixBlendMode: "multiply" }}
						/>
						<span className="text-[32px] font-bold tracking-[-0.5px]">
							Ludwigit
						</span>
					</div>

					{/* Tagline */}
					<p className="text-[14px] font-extrabold text-black/30 text-center leading-snug">
						A{" "}
						<span className="bg-gradient-to-r to-green-400 from-green-700 text-transparent bg-clip-text font-extrabold inline-block">
							straight to the point
						</span>{" "}
						URL shorterner.
						<br />
						No account, no payment, no tricks.
					</p>

					{/* URL input row */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-1 w-full"
					>
						<div className="flex items-end gap-1">
							<Input
								type="text"
								placeholder="Paste your long URL here..."
								className="flex-1 h-10 bg-background"
								aria-invalid={!!errors.url}
								{...register("url")}
							/>
							<Button
								type="submit"
								className="shrink-0 h-10 bg-[#53C25D] hover:bg-[#46AD50] text-white border-transparent"
							>
								Shorten
							</Button>
						</div>
						{errors.url && (
							<span className="text-xs text-destructive">
								{errors.url.message}
							</span>
						)}
					</form>

					{/* Result card */}
					{shortenedUrl && (
						<Card className="w-full gap-0 py-0">
							<CardContent className="px-4 py-3 flex items-center justify-between gap-2">
								<div className="flex flex-col">
									<span className="text-xs font-medium text-muted-foreground">
										Your shortened link
									</span>
									<span className="text-[15px] font-semibold">
										<span className="text-foreground/40">ludwigit.com</span>
										{new URL(shortenedUrl).pathname}
									</span>
								</div>
								<Button
									variant="secondary"
									size="sm"
									onClick={() => {
										copy(shortenedUrl);
										toast.success("Copied to clipboard!");
									}}
								>
									<Copy />
									Copy
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			<AdBanner />
		</div>
	);
}

export default App;

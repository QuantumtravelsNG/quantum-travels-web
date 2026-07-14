"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import ImageViewer, { type ImageViewerImage } from "@/components/ImageViewer";
import { isRemoteImage } from "@/lib/images";
import {
	formatPhotoCount,
	getGalleryFolderKey,
	type GalleryFolder,
} from "@/lib/quantum";

interface GalleryContentProps {
	folders: GalleryFolder[];
}

type GalleryTab = {
	key: string;
	label: string;
};

function getCategoryKey(category: string) {
	return category.trim().toLowerCase();
}

function getGalleryTabs(folders: GalleryFolder[]): GalleryTab[] {
	const categoryMap = new Map<string, string>();

	for (const folder of folders) {
		const key = getCategoryKey(folder.category);
		if (key && !categoryMap.has(key)) {
			categoryMap.set(key, folder.category);
		}
	}

	return [
		{ key: "all", label: "All Media" },
		...Array.from(categoryMap.entries()).map(([key, label]) => ({
			key,
			label,
		})),
	];
}

function MosaicImage({
	src,
	alt,
	className,
	sizes,
	onOpen,
}: {
	src: string;
	alt: string;
	className: string;
	sizes: string;
	onOpen: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onOpen}
			className={`relative block overflow-hidden bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E328A] ${className}`}
			aria-label={`View ${alt}`}
		>
			<Image
				src={src}
				alt={alt}
				fill
				sizes={sizes}
				className="object-cover"
				unoptimized={isRemoteImage(src)}
			/>
		</button>
	);
}

function GalleryMosaic({
	folder,
	onOpen,
}: {
	folder: GalleryFolder;
	onOpen: (index: number) => void;
}) {
	const [firstImage, secondImage, thirdImage] = folder.images;
	const altPrefix = folder.folderTitle;

	if (!firstImage) {
		return (
			<div className="flex h-[129px] w-full items-center justify-center rounded-[7px] bg-neutral-100 text-center text-xs font-medium text-neutral-500 md:h-[198px] md:text-sm">
				No photos
			</div>
		);
	}

	if (!secondImage) {
		return (
			<MosaicImage
				src={firstImage}
				alt={altPrefix}
				className="h-[129px] w-full rounded-[7px] md:h-[198px]"
				sizes="(min-width: 768px) 299px, 178px"
				onOpen={() => onOpen(0)}
			/>
		);
	}

	if (!thirdImage) {
		return (
			<div className="grid h-[129px] grid-cols-2 gap-[5px] md:h-[198px] md:gap-[7px]">
				<MosaicImage
					src={firstImage}
					alt={`${altPrefix} photo 1`}
					className="rounded-[5px]"
					sizes="(min-width: 768px) 146px, 86px"
					onOpen={() => onOpen(0)}
				/>
				<MosaicImage
					src={secondImage}
					alt={`${altPrefix} photo 2`}
					className="rounded-[7px]"
					sizes="(min-width: 768px) 146px, 86px"
					onOpen={() => onOpen(1)}
				/>
			</div>
		);
	}

	return (
		<div className="grid h-[129px] grid-cols-[62px_1fr] gap-[5px] md:h-[198px] md:grid-cols-[95px_1fr] md:gap-2">
			<div className="grid grid-rows-2 gap-[5px] md:gap-2">
				<MosaicImage
					src={firstImage}
					alt={`${altPrefix} photo 1`}
					className="rounded-[5px]"
					sizes="(min-width: 768px) 95px, 62px"
					onOpen={() => onOpen(0)}
				/>
				<MosaicImage
					src={secondImage}
					alt={`${altPrefix} photo 2`}
					className="rounded-[5px]"
					sizes="(min-width: 768px) 95px, 62px"
					onOpen={() => onOpen(1)}
				/>
			</div>
			<MosaicImage
				src={thirdImage}
				alt={`${altPrefix} photo 3`}
				className="rounded-[7px]"
				sizes="(min-width: 768px) 196px, 110px"
				onOpen={() => onOpen(2)}
			/>
		</div>
	);
}

function GalleryFolderTile({
	folder,
	onOpen,
}: {
	folder: GalleryFolder;
	onOpen: (folder: GalleryFolder, index: number) => void;
}) {
	return (
		<article className="w-full">
			<GalleryMosaic
				folder={folder}
				onOpen={(index) => onOpen(folder, index)}
			/>
			<h2 className="mt-4 truncate text-base font-semibold leading-normal text-foreground md:mt-6 md:text-2xl">
				{folder.folderTitle}
			</h2>
			<p className="text-xs font-light leading-[1.5] text-text md:text-xl">
				{formatPhotoCount(folder.images.length)}
			</p>
		</article>
	);
}

export default function GalleryContent({ folders }: GalleryContentProps) {
	const [activeTab, setActiveTab] = useState("all");
	const [viewerImages, setViewerImages] = useState<ImageViewerImage[] | null>(
		null,
	);
	const [viewerIndex, setViewerIndex] = useState(0);

	const tabs = useMemo(() => getGalleryTabs(folders), [folders]);
	const visibleFolders = useMemo(() => {
		if (activeTab === "all") return folders;

		return folders.filter(
			(folder) => getCategoryKey(folder.category) === activeTab,
		);
	}, [activeTab, folders]);

	function openFolder(folder: GalleryFolder, index: number) {
		if (folder.images.length === 0) return;

		setViewerImages(
			folder.images.map((src, index) => ({
				src,
				alt: `${folder.folderTitle} photo ${index + 1}`,
				caption: folder.folderTitle,
			})),
		);
		setViewerIndex(index);
	}

	return (
		<section className="mx-auto w-full max-w-[1244px] px-5 pb-10 pt-8 md:px-0 md:pb-16 md:pt-[82px]">
			<div className="max-w-7xl">
				<h1 className="max-w-[340px] text-2xl leading-normal font-black text-text md:max-w-none md:text-[44px]">
					Journey With Us{" "}
					<span className="text-[#9E328A]">Through The Years</span>
				</h1>
				<p className="mt-2 max-w-[835px] text-base font-light leading-[1.8] text-text md:text-[22px]">
					Moments that tell our story capturing the events, campaigns, and
					community engagements that shape our journey.
				</p>
			</div>

			<div className="mt-6 border-b border-black/20 md:mt-7 h-fit">
				<div
					className="flex gap-6 overflow-y-hidden overflow-x-auto  justify-between md:justify-start md:gap-11 h-fit"
					role="tablist"
					aria-label="Gallery categories"
				>
					{tabs.map((tab) => {
						const isActive = activeTab === tab.key;

						return (
							<button
								key={tab.key}
								type="button"
								role="tab"
								aria-selected={isActive}
								onClick={() => setActiveTab(tab.key)}
								className={`relative shrink-0  pb-3 text-base font-medium leading-normal md:text-xl ${
									isActive ? "text-text" : "text-black/50"
								}`}
							>
								{tab.label}
								{isActive && (
									<span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-black" />
								)}
							</button>
						);
					})}
				</div>
			</div>

			{visibleFolders.length > 0 ? (
				<div className="mt-5 grid grid-cols-2 gap-x-2 gap-y-2 md:mt-7 md:grid-cols-4 md:gap-4">
					{visibleFolders.map((folder, index) => (
						<GalleryFolderTile
							key={getGalleryFolderKey(folder, index)}
							folder={folder}
							onOpen={openFolder}
						/>
					))}
				</div>
			) : (
				<div className="flex min-h-[260px] items-center justify-center text-center text-base font-medium text-black/60 md:min-h-[360px] md:text-xl">
					No gallery folders are available for this category yet.
				</div>
			)}

			{viewerImages && (
				<ImageViewer
					images={viewerImages}
					currentIndex={viewerIndex}
					onClose={() => setViewerImages(null)}
					onNavigate={setViewerIndex}
				/>
			)}
		</section>
	);
}

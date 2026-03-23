import ApkReader from 'apkreader';

export interface ApkMetadata {
    packageName: string;
    versionCode: number;
    versionName: string;
    label: string;
    minSdkVersion?: number;
    targetSdkVersion?: number;
}

export async function analyzeApk(buffer: Buffer): Promise<ApkMetadata> {
    try {
        const reader = await ApkReader.open(buffer);
        const manifest = await reader.readManifest();
        
        // Find the label - usually in android:label
        let label = "Unknown Artifact";
        const resources = await reader.readResources();
        
        // Basic label extraction attempt
        if (manifest.application && manifest.application.label) {
            label = manifest.application.label;
        }

        return {
            packageName: manifest.package,
            versionCode: manifest.versionCode,
            versionName: manifest.versionName,
            label: label,
            minSdkVersion: manifest.minSdkVersion,
            targetSdkVersion: manifest.targetSdkVersion
        };
    } catch (error) {
        console.error("APK Analysis Failure:", error);
        throw new Error("Unable to parse APK metadata. Artifact integrity compromised.");
    }
}

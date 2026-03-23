"use server";

import { createSrvrClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { analyzeApk } from "@/lib/apk-analyzer";

export async function incrementDownload(appId: string) {
    const supabase = await createSrvrClient();

    // 1. Get Current Count
    const { data: app, error: fetchError } = await supabase
        .from('apps')
        .select('downloads')
        .eq('id', appId)
        .single();

    if (fetchError || !app) return { error: "Artifact_Not_Found" };

    // 2. Increment
    const { error: updateError } = await supabase
        .from('apps')
        .update({ downloads: (app.downloads || 0) + 1 })
        .eq('id', appId);

    if (updateError) return { error: "Deployment_Update_Failed" };

    revalidatePath(`/app/${appId}`);
    revalidatePath("/");
    revalidatePath("/dashboard");
    
    return { success: true, count: (app.downloads || 0) + 1 };
}

export async function publishApp(formData: any) {
    const supabase = await createSrvrClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Auth_Failure");

    const { error } = await supabase
        .from('apps')
        .insert({
            ...formData,
            publisher_id: user.id
        });

    if (error) throw error;
    revalidatePath("/");
}

export async function analyzeApkUpload(formData: FormData) {
    const file = formData.get("apkFile") as File;
    if (!file) return { error: "No artifact detected." };

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const metadata = await analyzeApk(buffer);
        return { success: true, metadata };
    } catch (e: any) {
        return { error: e.message || "Deep analysis failed." };
    }
}

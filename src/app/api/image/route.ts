import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = ["firebasestorage.googleapis.com", "127.0.0.1", "localhost"];

/**
 * Proxy de imágenes de Firebase Storage.
 * Evita problemas de CORS y dominios bloqueados en el cliente.
 */
export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return NextResponse.json({ error: "Falta el parámetro url" }, { status: 400 });
  }

  let url: URL;
  try {
    url = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(url.hostname)) {
    return NextResponse.json({ error: "URL no permitida" }, { status: 403 });
  }

  if (url.hostname === "127.0.0.1" || url.hostname === "localhost") {
    if (url.protocol !== "http:") {
      return NextResponse.json({ error: "Emulador debe usar http" }, { status: 403 });
    }
  } else if (url.protocol !== "https:") {
    return NextResponse.json({ error: "Solo HTTPS" }, { status: 403 });
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "LegalConnect-Image-Proxy/1.0",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Error al obtener imagen: ${res.status}` },
        { status: res.status }
      );
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error("[api/image] Error:", err);
    return NextResponse.json(
      { error: "Error al cargar la imagen" },
      { status: 500 }
    );
  }
}

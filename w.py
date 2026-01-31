"""
AI or Not Image Detection using aiornot.com API
Detects AI-generated images using their trained models.
"""
import requests
import sys
from pathlib import Path
from typing import Optional, Dict, Any
import json

class AIorNotDetector:
    """Client for AI or Not API."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.endpoint = "https://api.aiornot.com/v2/image/sync"
    
    def detect(self, image_path: str, external_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Detect if an image is AI-generated.
        
        Args:
            image_path: Path to the image file
            external_id: Optional tracking ID
            
        Returns:
            Dict with detection results
        """
        if not Path(image_path).exists():
            return {"error": f"File not found: {image_path}"}
        
        try:
            with open(image_path, "rb") as f:
                params = {}
                if external_id:
                    params["external_id"] = external_id
                
                response = requests.post(
                    self.endpoint,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    files={"image": f},
                    params=params,
                    timeout=30
                )
                
                response.raise_for_status()
                return response.json()
                
        except requests.exceptions.RequestException as e:
            return {"error": f"Request error: {str(e)}"}
        except json.JSONDecodeError as e:
            return {"error": f"JSON decode error: {str(e)}", "raw_response": response.text}
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}
    
    def detect_with_options(
        self, 
        image_path: str,
        only: Optional[list] = None,
        excluding: Optional[list] = None,
        external_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Detect with custom model selection.
        
        Args:
            image_path: Path to the image file
            only: List of models to run (e.g., ["ai_generated", "deepfake"])
            excluding: List of models to exclude
            external_id: Optional tracking ID
            
        Returns:
            Dict with detection results
        """
        if not Path(image_path).exists():
            return {"error": f"File not found: {image_path}"}
        
        try:
            with open(image_path, "rb") as f:
                params = {}
                if external_id:
                    params["external_id"] = external_id
                if only:
                    params["only"] = only
                if excluding:
                    params["excluding"] = excluding
                
                response = requests.post(
                    self.endpoint,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    files={"image": f},
                    params=params,
                    timeout=30
                )
                
                response.raise_for_status()
                return response.json()
                
        except requests.exceptions.RequestException as e:
            return {"error": f"Request error: {str(e)}"}
        except json.JSONDecodeError as e:
            return {"error": f"JSON decode error: {str(e)}", "raw_response": response.text}
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}


def format_result(result: Dict[str, Any]) -> str:
    """Format detection result for display."""
    if "error" in result:
        error_msg = f"❌ ERROR: {result['error']}"
        if "details" in result:
            error_msg += f"\nDetails: {result['details']}"
        if "raw_response" in result:
            error_msg += f"\nRaw Response: {result['raw_response'][:200]}"
        return error_msg
    
    # Extract report data (API wraps results in "report" key)
    report = result.get("report", {})
    
    output = []
    output.append("="*70)
    output.append("🤖 AI or Not Detection Results")
    output.append("="*70)
    
    # AI Generated detection
    if "ai_generated" in report and report["ai_generated"] is not None:
        ai_gen = report["ai_generated"]
        verdict = ai_gen.get("verdict", "unknown")
        
        ai_data = ai_gen.get("ai", {})
        human_data = ai_gen.get("human", {})
        
        is_ai = ai_data.get("is_detected", False)
        ai_confidence = ai_data.get("confidence", 0) * 100
        human_confidence = human_data.get("confidence", 0) * 100
        
        if verdict == "ai":
            output.append(f"\n🚨 RESULT: AI-GENERATED IMAGE")
            output.append(f"Confidence: {ai_confidence:.1f}%")
        elif verdict == "human":
            output.append(f"\n✅ RESULT: AUTHENTIC/HUMAN IMAGE")
            output.append(f"Confidence: {human_confidence:.1f}%")
        else:
            output.append(f"\n❓ RESULT: UNCERTAIN")
            output.append(f"AI: {ai_confidence:.1f}% | Human: {human_confidence:.1f}%")
    
    # Deepfake detection
    if "deepfake" in report and report["deepfake"] is not None:
        deepfake = report["deepfake"]
        is_deepfake = deepfake.get("is_detected", False)
        confidence = deepfake.get("confidence", 0) * 100
        rois = deepfake.get("rois", [])
        
        output.append(f"\n🎭 Deepfake Detection: {'YES' if is_deepfake else 'NO'}")
        output.append(f"   Confidence: {confidence:.1f}%")
        if rois:
            detected_rois = [r for r in rois if r.get("is_detected", False)]
            output.append(f"   Suspicious regions: {len(detected_rois)}/{len(rois)}")
    
    # NSFW detection
    if "nsfw" in report and report["nsfw"] is not None:
        nsfw = report["nsfw"]
        is_nsfw = nsfw.get("is_detected", False)
        
        output.append(f"\n🔞 NSFW: {'YES' if is_nsfw else 'NO'}")
    
    # Quality assessment
    if "quality" in report and report["quality"] is not None:
        quality = report["quality"]
        is_high_quality = quality.get("is_detected", False)
        
        output.append(f"⭐ Quality: {'High' if is_high_quality else 'Low/Medium'}")
    
    # Metadata
    if "meta" in report and report["meta"]:
        meta = report["meta"]
        output.append(f"\n📊 Image Info:")
        output.append(f"   Size: {meta.get('width')}x{meta.get('height')} ({meta.get('format')})")
        output.append(f"   File size: {meta.get('size_bytes', 0) / 1024:.1f} KB")
    
    output.append("\n" + "="*70)
    
    return "\n".join(output)


def main():
    # API Key (hardcoded for your use)
    API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjliZjMwOTM3LTg5NTgtNGM3My04MjBhLTliYzhjNmIxNWFhZCIsInVzZXJfaWQiOiI5NWQyZWFiYy00OWEwLTRhNTMtYWFmMy0yYmM2YmY5ZGY4MmMiLCJhdWQiOiJhY2Nlc3MiLCJleHAiOjE5Mjc0OTU3OTQsInNjb3BlIjoiYWxsIn0.Urg5rswT6D8oei-GPfrZherKeOAP1ekV0-y_n13PWVk"
    
    if len(sys.argv) < 2:
        print("Usage: python aiornot.py <image_path> [options]")
        print("\nExamples:")
        print("  python aiornot.py photo.jpg")
        print("  python aiornot.py photo.jpg --only ai_generated")
        print("  python aiornot.py photo.jpg --excluding deepfake")
        print("  python aiornot.py photo.jpg --json  (show full JSON)")
        print("\nAvailable models:")
        print("  - ai_generated (detects AI-generated images)")
        print("  - deepfake (detects deepfake images)")
        print("  - nsfw (detects NSFW content)")
        print("  - quality (assesses image quality)")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not Path(image_path).exists():
        print(f"❌ ERROR: File not found: {image_path}")
        sys.exit(1)
    
    print(f"\n📁 Analyzing: {Path(image_path).name}")
    print("⏳ Please wait...\n")
    
    detector = AIorNotDetector(API_KEY)
    
    # Parse command line options
    only = None
    excluding = None
    
    if "--only" in sys.argv:
        idx = sys.argv.index("--only")
        if idx + 1 < len(sys.argv):
            only = sys.argv[idx + 1].split(",")
    
    if "--excluding" in sys.argv:
        idx = sys.argv.index("--excluding")
        if idx + 1 < len(sys.argv):
            excluding = sys.argv[idx + 1].split(",")
    
    # Run detection
    if only or excluding:
        result = detector.detect_with_options(
            image_path,
            only=only,
            excluding=excluding,
            external_id=Path(image_path).stem
        )
    else:
        result = detector.detect(
            image_path,
            external_id=Path(image_path).stem
        )
    
    # Display results
    print(format_result(result))
    
    # Print raw JSON if requested
    if "--json" in sys.argv:
        print("\n📋 Full JSON Response:")
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
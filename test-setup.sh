#!/bin/bash
# Test Script untuk Verifikasi Backend & Frontend

echo "🧪 Testing Backend & Frontend Integration..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Check .env.local exists
echo "1️⃣  Checking .env.local file..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local exists${NC}"
else
    echo -e "${RED}❌ .env.local not found${NC}"
    echo "   Create .env.local from template!"
    exit 1
fi

# Test 2: Check if Supabase URL is set
echo ""
echo "2️⃣  Checking Supabase configuration..."
if grep -q "your-project.supabase.co" .env.local; then
    echo -e "${RED}⚠️  Supabase URL not configured${NC}"
    echo "   Please update .env.local with your Supabase credentials"
else
    echo -e "${GREEN}✅ Supabase URL configured${NC}"
fi

# Test 3: Check required files exist
echo ""
echo "3️⃣  Checking required files..."

files=(
    "src/app/api/register/route.ts"
    "src/app/api/login/route.ts"
    "src/app/api/logout/route.ts"
    "src/lib/supabase.ts"
    "src/lib/auth.ts"
    "src/components/auth-provider.tsx"
    "src/hooks/useProtectedPage.ts"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file${NC}"
        all_exist=false
    fi
done

# Test 4: Check dependencies
echo ""
echo "4️⃣  Checking dependencies..."
if [ -d "node_modules/@supabase/supabase-js" ]; then
    echo -e "${GREEN}✅ Supabase client installed${NC}"
else
    echo -e "${RED}❌ Supabase client not installed${NC}"
    echo "   Run: npm install"
fi

# Summary
echo ""
echo "================================================"
if [ "$all_exist" = true ]; then
    echo -e "${GREEN}✅ All files present!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure .env.local with Supabase credentials"
    echo "2. Run: npm install"
    echo "3. Run: npm run dev"
    echo "4. Open: http://localhost:3000"
else
    echo -e "${RED}❌ Some files are missing${NC}"
    echo "   Please check the project structure"
fi
echo "================================================"

# ⛽ Gas Rewards App for Individual Users
## Training Manual for Consumer Gas Cashback Apps (Like Upside)

---

## 🎯 Use Case: Personal Gas Rewards for Individual Drivers

**Examples:** Upside, GasBuddy, GetUpside, Fuel Rewards Network

**Customer:** Individual car owners, daily commuters, road trippers
**Users:** Single person managing their own gas purchases
**Scale:** One person, one vehicle (or family with multiple cars)

---

## 🏗️ Architecture for Single-User Gas Rewards

```
┌─────────────────────────────────────────────────────────┐
│               GAS REWARDS MOBILE APP                    │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  User 1      │  │  User 2      │  │  User 3      │
│  John Smith  │  │  Jane Doe    │  │  Bob Wilson  │
└──────────────┘  └──────────────┘  └──────────────┘
│                  │                  │
├─ Toyota Camry   ├─ Honda CR-V     ├─ Ford F-150
├─ 15 fill-ups    ├─ 23 fill-ups    ├─ 8 fill-ups
├─ $45 cashback   ├─ $67 cashback   ├─ $22 cashback
└─ Gold tier      └─ Platinum tier  └─ Silver tier
```

**Key Differences from Fleet:**
- **NO organizations** - Each user is independent
- **NO multi-tenant** - Everyone is equal, no company hierarchy
- **Simple permissions** - User can only see their own data
- **Focus:** Cashback, rewards, savings, nearby stations

---

## 📋 User Tiers (Not Roles)

Unlike fleet management with roles, gas rewards apps use **loyalty tiers**:

```
💎 PLATINUM (100+ fill-ups/year)
    │
    ├─ 15% cashback
    ├─ Exclusive station deals
    ├─ Premium customer support
    └─ Early access to new features
    
🥇 GOLD (50-99 fill-ups/year)
    │
    ├─ 10% cashback
    ├─ Most station deals
    └─ Priority support
    
🥈 SILVER (20-49 fill-ups/year)
    │
    ├─ 7% cashback
    └─ Standard deals
    
🥉 BRONZE (<20 fill-ups/year)
    │
    ├─ 5% cashback
    └─ Basic deals
```

**No permission system needed!** Each user only accesses their own data.

---

## 🔧 Step-by-Step Implementation

### STEP 1: Define User Tiers

**File:** `config/rewards-tiers.js`

```javascript
export const REWARDS_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

export const TIER_BENEFITS = {
  bronze: {
    name: 'Bronze',
    cashbackRate: 0.05,  // 5%
    minFillUps: 0,
    color: '#cd7f32',
    icon: '🥉',
    perks: ['5% cashback on all purchases']
  },
  silver: {
    name: 'Silver',
    cashbackRate: 0.07,  // 7%
    minFillUps: 20,
    color: '#c0c0c0',
    icon: '🥈',
    perks: ['7% cashback', 'Early access to special promotions']
  },
  gold: {
    name: 'Gold',
    cashbackRate: 0.10,  // 10%
    minFillUps: 50,
    color: '#ffd700',
    icon: '🥇',
    perks: ['10% cashback', 'Priority customer support', 'Bonus offers']
  },
  platinum: {
    name: 'Platinum',
    cashbackRate: 0.15,  // 15%
    minFillUps: 100,
    color: '#e5e4e2',
    icon: '💎',
    perks: ['15% cashback', 'VIP support', 'Exclusive station partnerships', 'Birthday bonus']
  }
};

// Calculate tier based on fill-ups in the last year
export function calculateUserTier(fillUpsLastYear) {
  if (fillUpsLastYear >= 100) return REWARDS_TIERS.PLATINUM;
  if (fillUpsLastYear >= 50) return REWARDS_TIERS.GOLD;
  if (fillUpsLastYear >= 20) return REWARDS_TIERS.SILVER;
  return REWARDS_TIERS.BRONZE;
}

// Calculate cashback for a purchase
export function calculateCashback(amount, tier) {
  const rate = TIER_BENEFITS[tier]?.cashbackRate || 0.05;
  return amount * rate;
}
```

---

### STEP 2: Design Database Schema

**File:** `supabase/migrations/gas_rewards_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- GAS REWARDS SINGLE-USER TABLES
-- =============================================

-- Users (Individual customers, NOT multi-tenant)
CREATE TABLE gas_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  
  -- Rewards tier
  current_tier TEXT DEFAULT 'bronze' CHECK (current_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  total_cashback_earned DECIMAL(10, 2) DEFAULT 0,
  cashback_available DECIMAL(10, 2) DEFAULT 0,  -- Ready to withdraw
  cashback_pending DECIMAL(10, 2) DEFAULT 0,     -- Waiting for verification
  
  -- Preferences
  home_address TEXT,
  home_lat DECIMAL(10, 7),
  home_lng DECIMAL(10, 7),
  preferred_fuel_type TEXT CHECK (preferred_fuel_type IN ('regular', 'midgrade', 'premium', 'diesel')),
  favorite_stations UUID[],  -- Array of station IDs
  
  -- Notifications
  price_alert_enabled BOOLEAN DEFAULT TRUE,
  cashback_alert_enabled BOOLEAN DEFAULT TRUE,
  deal_notifications BOOLEAN DEFAULT TRUE,
  
  -- Account
  payment_method_id TEXT,  -- Stripe customer ID
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES gas_users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Vehicles (Optional - users can track multiple cars)
CREATE TABLE user_vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES gas_users(id) ON DELETE CASCADE NOT NULL,
  nickname TEXT NOT NULL,  -- "My Honda", "Wife's Car"
  make TEXT,
  model TEXT,
  year INTEGER,
  fuel_type TEXT,
  tank_size DECIMAL(5, 2),  -- Gallons
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gas Stations (Public data)
CREATE TABLE gas_stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_name TEXT NOT NULL,
  brand TEXT,  -- Shell, Chevron, BP, etc.
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  
  -- Current prices (updated frequently)
  price_regular DECIMAL(5, 3),
  price_midgrade DECIMAL(5, 3),
  price_premium DECIMAL(5, 3),
  price_diesel DECIMAL(5, 3),
  price_updated_at TIMESTAMPTZ,
  
  -- Cashback rates at this station
  cashback_rate_bronze DECIMAL(5, 4) DEFAULT 0.05,
  cashback_rate_silver DECIMAL(5, 4) DEFAULT 0.07,
  cashback_rate_gold DECIMAL(5, 4) DEFAULT 0.10,
  cashback_rate_platinum DECIMAL(5, 4) DEFAULT 0.15,
  
  -- Features
  amenities TEXT[],  -- ['car_wash', 'convenience_store', 'restrooms', 'atm']
  accepts_credit BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fill-Ups (Gas purchases)
CREATE TABLE fillups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES gas_users(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES user_vehicles(id),
  station_id UUID REFERENCES gas_stations(id),
  
  -- Purchase details
  fuel_type TEXT NOT NULL,
  gallons DECIMAL(10, 3) NOT NULL,
  price_per_gallon DECIMAL(5, 3) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  
  -- Cashback
  user_tier_at_purchase TEXT NOT NULL,
  cashback_rate DECIMAL(5, 4) NOT NULL,
  cashback_earned DECIMAL(10, 2) NOT NULL,
  cashback_status TEXT DEFAULT 'pending' CHECK (cashback_status IN ('pending', 'approved', 'paid', 'rejected')),
  
  -- Verification
  receipt_image_url TEXT,
  verified_at TIMESTAMPTZ,
  purchase_date TIMESTAMPTZ NOT NULL,
  
  -- Location verification
  user_lat DECIMAL(10, 7),
  user_lng DECIMAL(10, 7),
  distance_from_station DECIMAL(10, 2),  -- In miles
  
  -- Odometer (optional)
  odometer DECIMAL(10, 1),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cashback Transactions (Withdrawals, bonuses, etc.)
CREATE TABLE cashback_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES gas_users(id) ON DELETE CASCADE NOT NULL,
  
  type TEXT NOT NULL CHECK (type IN ('fillup', 'withdrawal', 'bonus', 'referral', 'adjustment')),
  amount DECIMAL(10, 2) NOT NULL,  -- Positive for earned, negative for withdrawn
  
  -- If withdrawal
  payment_method TEXT,  -- 'paypal', 'bank_transfer', 'gift_card'
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_reference TEXT,
  
  -- Related records
  fillup_id UUID REFERENCES fillups(id),
  
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals & Promotions
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  
  -- Deal details
  deal_type TEXT CHECK (deal_type IN ('bonus_cashback', 'fixed_discount', 'free_item')),
  bonus_percentage DECIMAL(5, 4),  -- Extra 2% = 0.02
  minimum_purchase DECIMAL(10, 2),
  
  -- Targeting
  eligible_tiers TEXT[],  -- ['gold', 'platinum']
  specific_stations UUID[],  -- Station IDs, or NULL for all
  max_uses_per_user INTEGER DEFAULT 1,
  
  -- Dates
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Deal Usage
CREATE TABLE user_deal_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES gas_users(id) ON DELETE CASCADE NOT NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  fillup_id UUID REFERENCES fillups(id),
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, deal_id, fillup_id)
);

-- Price Alerts
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES gas_users(id) ON DELETE CASCADE NOT NULL,
  
  -- Alert criteria
  fuel_type TEXT NOT NULL,
  max_price DECIMAL(5, 3) NOT NULL,  -- Alert when price drops below this
  radius_miles DECIMAL(5, 2) DEFAULT 5,  -- Search within 5 miles
  center_lat DECIMAL(10, 7),
  center_lng DECIMAL(10, 7),
  
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES gas_users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES gas_users(id) ON DELETE CASCADE NOT NULL,
  
  -- Rewards
  referrer_bonus DECIMAL(10, 2) DEFAULT 10.00,
  referred_bonus DECIMAL(10, 2) DEFAULT 5.00,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  completed_at TIMESTAMPTZ,  -- When referred user made first purchase
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_gas_users_clerk_id ON gas_users(clerk_id);
CREATE INDEX idx_gas_users_referral_code ON gas_users(referral_code);
CREATE INDEX idx_gas_users_tier ON gas_users(current_tier);

CREATE INDEX idx_user_vehicles_user_id ON user_vehicles(user_id);

CREATE INDEX idx_gas_stations_location ON gas_stations(latitude, longitude);
CREATE INDEX idx_gas_stations_brand ON gas_stations(brand);
CREATE INDEX idx_gas_stations_active ON gas_stations(is_active);

CREATE INDEX idx_fillups_user_id ON fillups(user_id);
CREATE INDEX idx_fillups_station_id ON fillups(station_id);
CREATE INDEX idx_fillups_purchase_date ON fillups(purchase_date);
CREATE INDEX idx_fillups_cashback_status ON fillups(cashback_status);

CREATE INDEX idx_cashback_transactions_user_id ON cashback_transactions(user_id);
CREATE INDEX idx_cashback_transactions_type ON cashback_transactions(type);

CREATE INDEX idx_deals_active ON deals(is_active);
CREATE INDEX idx_deals_dates ON deals(start_date, end_date);

CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE gas_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gas_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fillups ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashback_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_deal_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION current_gas_user_id()
RETURNS UUID AS $$
  SELECT id FROM gas_users WHERE clerk_id = (auth.jwt() ->> 'sub')::text;
$$ LANGUAGE SQL SECURITY DEFINER;

-- =============================================
-- SIMPLE RLS POLICIES (NO MULTI-TENANT!)
-- =============================================

-- Users: See only yourself
CREATE POLICY gas_users_select ON gas_users
FOR SELECT USING (
  clerk_id = (auth.jwt() ->> 'sub')::text
);

CREATE POLICY gas_users_update ON gas_users
FOR UPDATE USING (
  clerk_id = (auth.jwt() ->> 'sub')::text
);

-- Vehicles: See only your vehicles
CREATE POLICY user_vehicles_select ON user_vehicles
FOR SELECT USING (user_id = current_gas_user_id());

CREATE POLICY user_vehicles_insert ON user_vehicles
FOR INSERT WITH CHECK (user_id = current_gas_user_id());

CREATE POLICY user_vehicles_update ON user_vehicles
FOR UPDATE USING (user_id = current_gas_user_id());

CREATE POLICY user_vehicles_delete ON user_vehicles
FOR DELETE USING (user_id = current_gas_user_id());

-- Gas Stations: PUBLIC - everyone can see all stations
CREATE POLICY gas_stations_select ON gas_stations
FOR SELECT USING (TRUE);

-- Fill-ups: See only your fill-ups
CREATE POLICY fillups_select ON fillups
FOR SELECT USING (user_id = current_gas_user_id());

CREATE POLICY fillups_insert ON fillups
FOR INSERT WITH CHECK (user_id = current_gas_user_id());

-- Cashback Transactions: See only your transactions
CREATE POLICY cashback_transactions_select ON cashback_transactions
FOR SELECT USING (user_id = current_gas_user_id());

-- Deals: PUBLIC - everyone can see active deals
CREATE POLICY deals_select ON deals
FOR SELECT USING (is_active = TRUE);

-- User Deal Usage: See only your usage
CREATE POLICY user_deal_usage_select ON user_deal_usage
FOR SELECT USING (user_id = current_gas_user_id());

CREATE POLICY user_deal_usage_insert ON user_deal_usage
FOR INSERT WITH CHECK (user_id = current_gas_user_id());

-- Price Alerts: See only your alerts
CREATE POLICY price_alerts_select ON price_alerts
FOR SELECT USING (user_id = current_gas_user_id());

CREATE POLICY price_alerts_insert ON price_alerts
FOR INSERT WITH CHECK (user_id = current_gas_user_id());

CREATE POLICY price_alerts_update ON price_alerts
FOR UPDATE USING (user_id = current_gas_user_id());

CREATE POLICY price_alerts_delete ON price_alerts
FOR DELETE USING (user_id = current_gas_user_id());

-- Referrals: See referrals you made or received
CREATE POLICY referrals_select ON referrals
FOR SELECT USING (
  referrer_id = current_gas_user_id() OR
  referred_id = current_gas_user_id()
);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gas_users_updated_at BEFORE UPDATE ON gas_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gas_stations_updated_at BEFORE UPDATE ON gas_stations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCTIONS FOR TIER CALCULATION
-- =============================================

-- Auto-update user tier based on fill-ups
CREATE OR REPLACE FUNCTION update_user_tier()
RETURNS TRIGGER AS $$
DECLARE
  fillup_count INTEGER;
  new_tier TEXT;
BEGIN
  -- Count fill-ups in last year
  SELECT COUNT(*) INTO fillup_count
  FROM fillups
  WHERE user_id = NEW.user_id
    AND purchase_date >= NOW() - INTERVAL '1 year'
    AND cashback_status = 'approved';
  
  -- Determine tier
  IF fillup_count >= 100 THEN
    new_tier := 'platinum';
  ELSIF fillup_count >= 50 THEN
    new_tier := 'gold';
  ELSIF fillup_count >= 20 THEN
    new_tier := 'silver';
  ELSE
    new_tier := 'bronze';
  END IF;
  
  -- Update user tier
  UPDATE gas_users
  SET current_tier = new_tier
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_tier AFTER INSERT ON fillups
  FOR EACH ROW EXECUTE FUNCTION update_user_tier();

-- Auto-update cashback balance
CREATE OR REPLACE FUNCTION update_cashback_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.cashback_status = 'approved' AND OLD.cashback_status = 'pending' THEN
    -- Move from pending to available
    UPDATE gas_users
    SET 
      cashback_pending = cashback_pending - NEW.cashback_earned,
      cashback_available = cashback_available + NEW.cashback_earned,
      total_cashback_earned = total_cashback_earned + NEW.cashback_earned
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_cashback AFTER UPDATE ON fillups
  FOR EACH ROW EXECUTE FUNCTION update_cashback_balance();
```

---

## 🎨 Gas Rewards UI Components

### Component 1: Simple Onboarding

**File:** `pages/gas/GasOnboardingPage.jsx`

```javascript
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function GasOnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [homeAddress, setHomeAddress] = useState('');
  const [preferredFuel, setPreferredFuel] = useState('regular');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create user record in Supabase
    const supabase = useAuthenticatedSupabase();
    
    // Generate unique referral code
    const referralCode = user.firstName?.substring(0, 3).toUpperCase() + 
                        Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await supabase
      .from('gas_users')
      .insert([{
        clerk_id: user.id,
        email: user.primaryEmailAddress.emailAddress,
        first_name: user.firstName,
        last_name: user.lastName,
        home_address: homeAddress,
        preferred_fuel_type: preferredFuel,
        current_tier: 'bronze',
        referral_code: referralCode
      }]);
    
    await user.update({
      publicMetadata: { onboarded: true }
    });
    
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⛽</div>
        <h1 style={{ color: '#1e40af', marginBottom: '8px' }}>Welcome to Gas Rewards!</h1>
        <p style={{ color: '#60a5fa' }}>Start earning cashback on every fill-up</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600' }}>
            Home Address (optional)
          </label>
          <input 
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            placeholder="123 Main St, City, State"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <div style={{ fontSize: '12px', color: '#60a5fa', marginTop: '4px' }}>
            We'll show you nearby gas stations
          </div>
        </div>
        
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600' }}>
            Preferred Fuel Type
          </label>
          <select
            value={preferredFuel}
            onChange={(e) => setPreferredFuel(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="regular">Regular (87)</option>
            <option value="midgrade">Mid-Grade (89)</option>
            <option value="premium">Premium (91+)</option>
            <option value="diesel">Diesel</option>
          </select>
        </div>
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Start Saving on Gas
        </button>
      </form>
    </div>
  );
}
```

---

### Component 2: Find Nearby Stations

**File:** `pages/gas/FindStationsPage.jsx`

```javascript
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export default function FindStationsPage() {
  const { user } = useUser();
  const [stations, setStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
    
    // Fetch user data
    async function fetchUser() {
      const supabase = useAuthenticatedSupabase();
      const { data } = await supabase
        .from('gas_users')
        .select('*')
        .eq('clerk_id', user.id)
        .single();
      setUserData(data);
    }
    fetchUser();
  }, [user]);

  useEffect(() => {
    if (!userLocation) return;
    
    async function fetchNearbyStations() {
      const supabase = useAuthenticatedSupabase();
      
      // In production, use PostGIS for distance calculation
      // This is simplified
      const { data } = await supabase
        .from('gas_stations')
        .select('*')
        .eq('is_active', true)
        .limit(20);
      
      setStations(data || []);
    }
    fetchNearbyStations();
  }, [userLocation]);

  const getCashbackRate = (station) => {
    const tier = userData?.current_tier || 'bronze';
    return station[`cashback_rate_${tier}`] || 0.05;
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ color: '#1e40af', marginBottom: '24px' }}>⛽ Nearby Gas Stations</h1>
      
      {/* User's Current Tier */}
      {userData && (
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '14px', marginBottom: '4px' }}>Your Tier</div>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            {userData.current_tier.toUpperCase()}
          </div>
          <div style={{ fontSize: '14px' }}>
            ${userData.cashback_available.toFixed(2)} cashback available
          </div>
        </div>
      )}
      
      {/* Stations List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {stations.map(station => {
          const cashbackRate = getCashbackRate(station);
          const preferredPrice = station[`price_${userData?.preferred_fuel_type || 'regular'}`];
          const cashbackPerGallon = preferredPrice * cashbackRate;
          
          return (
            <div
              key={station.id}
              style={{
                background: 'white',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af' }}>
                    {station.station_name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#60a5fa' }}>
                    {station.address}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>
                    ${preferredPrice}
                  </div>
                  <div style={{ fontSize: '12px', color: '#60a5fa' }}>per gallon</div>
                </div>
              </div>
              
              <div style={{
                background: '#f0f9ff',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ fontSize: '14px', color: '#1e40af', marginBottom: '4px' }}>
                  💰 Your Cashback
                </div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6' }}>
                  ${cashbackPerGallon.toFixed(3)} per gallon ({(cashbackRate * 100).toFixed(0)}%)
                </div>
                <div style={{ fontSize: '12px', color: '#60a5fa', marginTop: '4px' }}>
                  Save ${(cashbackPerGallon * 15).toFixed(2)} on 15 gallons
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

### Component 3: Record Fill-Up

**File:** `pages/gas/RecordFillUpPage.jsx`

```javascript
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { calculateCashback } from '../../config/rewards-tiers';

export default function RecordFillUpPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [stations, setStations] = useState([]);
  
  const [selectedStation, setSelectedStation] = useState('');
  const [fuelType, setFuelType] = useState('regular');
  const [gallons, setGallons] = useState('');
  const [pricePerGallon, setPricePerGallon] = useState('');

  useEffect(() => {
    async function fetchData() {
      const supabase = useAuthenticatedSupabase();
      
      // Get user
      const { data: user } = await supabase
        .from('gas_users')
        .select('*')
        .eq('clerk_id', user.id)
        .single();
      setUserData(user);
      
      // Get nearby stations
      const { data: stations } = await supabase
        .from('gas_stations')
        .select('*')
        .eq('is_active', true)
        .limit(20);
      setStations(stations || []);
    }
    fetchData();
  }, [user]);

  const totalAmount = gallons && pricePerGallon ? (parseFloat(gallons) * parseFloat(pricePerGallon)).toFixed(2) : '0.00';
  const cashbackAmount = userData ? calculateCashback(parseFloat(totalAmount), userData.current_tier) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const supabase = useAuthenticatedSupabase();
    const station = stations.find(s => s.id === selectedStation);
    
    await supabase
      .from('fillups')
      .insert([{
        user_id: userData.id,
        station_id: selectedStation,
        fuel_type: fuelType,
        gallons: parseFloat(gallons),
        price_per_gallon: parseFloat(pricePerGallon),
        total_amount: parseFloat(totalAmount),
        user_tier_at_purchase: userData.current_tier,
        cashback_rate: station[`cashback_rate_${userData.current_tier}`],
        cashback_earned: cashbackAmount,
        cashback_status: 'pending',  // Will be approved after verification
        purchase_date: new Date().toISOString()
      }]);
    
    // Update pending cashback
    await supabase
      .from('gas_users')
      .update({
        cashback_pending: userData.cashback_pending + cashbackAmount
      })
      .eq('id', userData.id);
    
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#1e40af', marginBottom: '24px' }}>⛽ Record Fill-Up</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Station */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600' }}>
            Gas Station
          </label>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="">Select station</option>
            {stations.map(station => (
              <option key={station.id} value={station.id}>
                {station.station_name} - {station.address}
              </option>
            ))}
          </select>
        </div>
        
        {/* Fuel Type */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600' }}>
            Fuel Type
          </label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value="regular">Regular (87)</option>
            <option value="midgrade">Mid-Grade (89)</option>
            <option value="premium">Premium (91+)</option>
            <option value="diesel">Diesel</option>
          </select>
        </div>
        
        {/* Gallons */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600' }}>
            Gallons
          </label>
          <input
            type="number"
            step="0.001"
            value={gallons}
            onChange={(e) => setGallons(e.target.value)}
            placeholder="15.234"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>
        
        {/* Price Per Gallon */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600' }}>
            Price Per Gallon
          </label>
          <input
            type="number"
            step="0.001"
            value={pricePerGallon}
            onChange={(e) => setPricePerGallon(e.target.value)}
            placeholder="3.499"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
        </div>
        
        {/* Cashback Preview */}
        {totalAmount > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>You'll Earn</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>
              ${cashbackAmount.toFixed(2)}
            </div>
            <div style={{ fontSize: '14px' }}>
              Total: ${totalAmount} • Tier: {userData?.current_tier.toUpperCase()}
            </div>
          </div>
        )}
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Record Fill-Up
        </button>
      </form>
    </div>
  );
}
```

---

## 📊 Key Features for Gas Rewards

### Must-Have Features:

1. **Station Finder**
   - Map view with pins
   - Current gas prices
   - Cashback rates by tier
   - Distance from user
   - User reviews

2. **Fill-Up Tracking**
   - Quick entry form
   - Photo upload of receipt
   - Automatic location capture
   - MPG calculation
   - Spending trends

3. **Cashback Management**
   - Current balance (available + pending)
   - Transaction history
   - Withdrawal to PayPal/bank
   - Gift card redemption
   - Referral bonuses

4. **Tier Progress**
   - Current tier badge
   - Next tier requirements
   - Fill-ups this year
   - Total savings
   - Tier benefits

5. **Price Alerts**
   - Set target price
   - Radius around home/work
   - Push notifications
   - SMS alerts
   - Email digests

6. **Deals & Promos**
   - Special bonus offers
   - Limited-time deals
   - Station partnerships
   - Holiday bonuses
   - Birthday rewards

---

## 🎯 How It Differs from Fleet Management

| Aspect | Fleet Management | Gas Rewards |
|--------|-----------------|-------------|
| **Multi-tenant** | ✅ Companies isolated | ❌ All users equal |
| **Roles** | Admin, Manager, Driver | No roles, just tiers |
| **Permissions** | Complex (who can edit what) | Simple (user sees only their data) |
| **Focus** | Fleet efficiency, cost control | Personal savings, cashback |
| **Main KPI** | Cost per mile, fleet spend | Cashback earned, money saved |
| **Social** | Internal team only | Public reviews, referrals |

---

## 🔑 Critical Differences in Code

### 1. NO Organization ID
```javascript
// Fleet Management (Multi-tenant)
company_id UUID REFERENCES fleet_companies(id)  // Required!

// Gas Rewards (Single user)
// No company_id at all - each user is independent
```

### 2. Public Data
```javascript
// Fleet Management
// Vehicles are private to company

// Gas Rewards
// Stations are PUBLIC - everyone sees all stations
CREATE POLICY gas_stations_select ON gas_stations
FOR SELECT USING (TRUE);  // Everyone can see
```

### 3. Simple RLS
```javascript
// Fleet Management
company_id = current_fleet_company_id()

// Gas Rewards
user_id = current_gas_user_id()  // That's it!
```

### 4. Tiers vs Roles
```javascript
// Fleet Management
hasPermission(userRole, 'canAddVehicle')

// Gas Rewards
// No permission checking needed!
// Just: if (userData.current_tier === 'platinum') { ... }
```

---

## 🚀 Quick Start for Gas Rewards App

```bash
# 1. Start with Clerk (NO organizations feature)
# 2. Database schema without organization_id
# 3. Focus on:
#    - User record
#    - Fill-ups
#    - Cashback tracking
#    - Stations (public)
# 4. Add tier logic
# 5. Build map view
# 6. Implement cashback withdrawals
```

**Time:** ~2-3 hours (simpler than fleet because no multi-tenant!)

---

## 📚 Gas Rewards-Specific Features to Add

- [ ] Map view with station pins
- [ ] Receipt OCR (auto-extract price from photo)
- [ ] Route-based station suggestions
- [ ] Social features (share savings with friends)
- [ ] Gamification (badges, streaks)
- [ ] Push notifications for price drops
- [ ] Integration with gas APIs (GasBuddy, AAA)
- [ ] Carbon offset program

---

## 💡 Summary

**Gas Rewards is perfect for:**
- Individual drivers wanting cashback
- Road trippers tracking spending
- Budget-conscious families
- Gig economy workers (Uber, DoorDash)
- Anyone who drives regularly

**NO multi-tenant complexity:**
- Each user is independent
- No organizations
- No complex permissions
- Simple: user → fillups → cashback

**Same Clerk + Supabase stack, WAY simpler data model!** ⛽💰

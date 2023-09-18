// Settings.tsx
import { FaChevronRight } from 'react-icons/fa';
interface SettingOptionProps {
    title: string;
    description: string;
    actionIcon?: React.ReactNode;  // This means the prop is optional and, when provided, should be a React component or element
  }
  

  const SettingOption: React.FC<SettingOptionProps> = ({ title, description, actionIcon = <FaChevronRight /> }) => {
    return (
    <div className="border-b border-gray-200 py-3 px-4 flex justify-between items-center">
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div>
        {actionIcon}
      </div>
    </div>
  );
}

const Settings = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <SettingOption title="Profile" description="Manage your profile and personal info" />
      <SettingOption title="Security" description="Update password and enable 2FA" />
      <SettingOption title="Wallet" description="Backup, restore, or reset wallet" />
      <SettingOption title="Notifications" description="Choose notification preferences" />
      <SettingOption title="Currency Display" description="Set your default display currency" />
      <SettingOption title="Theme" description="Choose between light and dark mode" />
      <SettingOption title="About" description="Version info, terms, and privacy policy" />

    </div>
  );
}

export default Settings;

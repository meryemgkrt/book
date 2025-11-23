import { Text } from 'react-native';

export default function CustomText({ style, bold, ...props }) {
  return (
    <Text 
      style={[
        { fontFamily: bold ? 'JetBrainsMono-Bold' : 'JetBrainsMono-Regular' },
        style
      ]} 
      {...props}
    />
  );
}
import { useCallback, useRef } from 'react';

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'notification' | 'pop';

export function useSound() {
    const audioContextRef = useRef<AudioContext | null>(null);

    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContextRef.current;
    }, []);

    const playSound = useCallback((type: SoundType, volume: number = 0.3) => {
        try {
            const audioContext = getAudioContext();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Set volume
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

            switch (type) {
                case 'click':
                    // Short click sound
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;

                case 'hover':
                    // Subtle hover sound
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.05);
                    break;

                case 'success':
                    // Success sound (rising tone)
                    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(784, audioContext.currentTime + 0.1);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;

                case 'error':
                    // Error sound (descending tone)
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.15);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;

                case 'notification':
                    // Notification sound (double beep)
                    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.08);

                    // Second beep
                    const osc2 = audioContext.createOscillator();
                    const gain2 = audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioContext.destination);
                    osc2.frequency.setValueAtTime(1047, audioContext.currentTime + 0.1);
                    gain2.gain.setValueAtTime(volume, audioContext.currentTime + 0.1);
                    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.18);
                    osc2.start(audioContext.currentTime + 0.1);
                    osc2.stop(audioContext.currentTime + 0.18);
                    break;

                case 'pop':
                    // Pop sound
                    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.05);
                    gainNode.gain.setValueAtTime(volume * 1.5, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.05);
                    break;
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }, [getAudioContext]);

    return { playSound };
}
